import asyncio
import logging
import re
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path

import nh3
import pypandoc
import redis.asyncio as aioredis
import tinycss2
import yaml
from fastapi import Depends, FastAPI, HTTPException
from lxml import etree
from lxml import html as lxml_html
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from db import dispose_engine, get_session, get_session_factory, init_engine
from models.article import Article
from schemas.article import ArticleSchema

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

def _load_config() -> dict:
    config_path = Path(__file__).parent / "config" / "config.yaml"
    with config_path.open() as f:
        return yaml.safe_load(f)


def _load_redis_cfg() -> dict:
    return _load_config()["redis"]


def _load_batch_cfg() -> dict:
    return _load_config().get("batch_convert", {})


# ---------------------------------------------------------------------------
# Application-level exceptions
# ---------------------------------------------------------------------------

class ArticleNotFoundError(Exception):
    pass


class UnsupportedMimetypeError(Exception):
    pass


# ---------------------------------------------------------------------------
# HTML / CSS sanitization helpers
# ---------------------------------------------------------------------------

# Extend nh3's default attribute allowlist so that `class` is preserved on
# every tag pandoc uses for syntax-highlighted code blocks:
#   <div class="sourceCode">, <pre class="sourceCode python">,
#   <code class="sourceCode python">, <span class="kw"> …
_SANITIZE_ATTRIBUTES: dict[str, set[str]] = {
    tag: set(attrs) for tag, attrs in nh3.ALLOWED_ATTRIBUTES.items()
}
for _tag in ("div", "pre", "code", "span"):
    _SANITIZE_ATTRIBUTES.setdefault(_tag, set()).add("class")

# Only CSS identifier characters are safe inside a class value token.
_CLASS_TOKEN_RE = re.compile(r"^[a-zA-Z0-9_-]+$")

# Dangerous CSS value patterns (XSS vectors).
_DANGEROUS_CSS_RE = re.compile(
    r"expression\s*\(|javascript\s*:|behavior\s*:|-moz-binding\s*:|vbscript\s*:",
    re.IGNORECASE,
)


def _attribute_filter(tag: str, attribute: str, value: str) -> str | None:
    """Validate class attribute values token-by-token; remove unsafe tokens."""
    if attribute == "class":
        safe = [t for t in value.split() if _CLASS_TOKEN_RE.match(t)]
        return " ".join(safe) or None
    return value


def _sanitize_css(css: str) -> str:
    """
    Parse and re-serialize CSS produced by pandoc, stripping:
    - @import / @charset / @namespace (external resource loading)
    - Any qualified rule whose declaration block contains known XSS patterns
    """
    rules = tinycss2.parse_stylesheet(css, skip_comments=True, skip_whitespace=True)
    safe: list = []
    for rule in rules:
        if rule.type == "error":
            continue
        if rule.type == "at-rule":
            if rule.at_keyword.lower() in ("import", "charset", "namespace"):
                continue
        elif rule.type == "qualified-rule":
            block = tinycss2.serialize(rule.content)
            if _DANGEROUS_CSS_RE.search(block):
                continue
        safe.append(rule)
    return tinycss2.serialize(safe)


def _split_pandoc_output(full_html: str) -> tuple[str, str]:
    """
    Given pandoc --standalone HTML, return (body_inner_html, css).

    Extracts the concatenated text of all <style> blocks as CSS, and the
    inner HTML of <body> as the content string.
    """
    doc = lxml_html.document_fromstring(full_html)

    css_parts: list[str] = []
    for style_el in doc.xpath("//style"):
        text = style_el.text_content()
        if text:
            css_parts.append(text)

    body_el = doc.find(".//body")
    if body_el is None:
        body_html = full_html
    else:
        body_html = (body_el.text or "") + "".join(
            etree.tostring(child, encoding="unicode", method="html")
            for child in body_el
        )

    return body_html, "\n".join(css_parts)


# ---------------------------------------------------------------------------
# Core render logic  (shared by the HTTP handler and the stream consumer)
# ---------------------------------------------------------------------------

async def _render_article(uid: uuid.UUID, session: AsyncSession) -> Article:
    """
    Fetch, render Markdown → HTML, sanitize, and persist an article.

    Raises:
        ArticleNotFoundError: if no article with the given uid exists.
        UnsupportedMimetypeError: if the article mimetype is not text/markdown.
    """
    result = await session.execute(select(Article).where(Article.uid == uid))
    article = result.scalars().first()
    if article is None:
        raise ArticleNotFoundError(f"Article {uid} not found")
    if article.mimetype != "text/markdown":
        raise UnsupportedMimetypeError(
            f"Unsupported mimetype '{article.mimetype}': only text/markdown is supported."
        )

    full_html = await asyncio.to_thread(
        pypandoc.convert_text,
        article.body,
        "html",
        format="markdown",
        extra_args=["--standalone"],
    )

    body_html, raw_css = _split_pandoc_output(full_html)

    article.content = nh3.clean(
        body_html,
        attributes=_SANITIZE_ATTRIBUTES,
        attribute_filter=_attribute_filter,
    )
    article.styles = _sanitize_css(raw_css)
    article.convert_time = datetime.now(timezone.utc).replace(tzinfo=None)

    await session.commit()
    await session.refresh(article)
    return article


# ---------------------------------------------------------------------------
# Batch convert logic  (shared by the background task and the HTTP trigger)
# ---------------------------------------------------------------------------

async def _do_batch_convert(limit: int = 100) -> dict:
    """
    Query articles where convert_time IS NULL or convert_time < update_time,
    render each one, and return summary stats.
    Only text/markdown articles are considered.
    """
    session_factory = get_session_factory()

    async with session_factory() as session:
        result = await session.execute(
            select(Article.uid)
            .where(Article.mimetype == "text/markdown")
            .where(
                or_(
                    Article.convert_time == None,  # noqa: E711
                    Article.convert_time < Article.update_time,
                )
            )
            .limit(limit)
        )
        uids = result.scalars().all()

    success = failed = skipped = 0
    for uid in uids:
        try:
            async with session_factory() as session:
                await _render_article(uid, session)
            success += 1
        except (ArticleNotFoundError, UnsupportedMimetypeError) as e:
            logger.warning("Batch convert skipping article %s: %s", uid, e)
            skipped += 1
        except Exception:
            logger.exception("Batch convert failed for article %s", uid)
            failed += 1

    logger.info(
        "Batch convert finished: total=%d success=%d skipped=%d failed=%d",
        len(uids), success, skipped, failed,
    )
    return {"total": len(uids), "success": success, "skipped": skipped, "failed": failed}


async def _batch_converter_task() -> None:
    """
    Permanent background task: periodically triggers _do_batch_convert.
    Interval and limit are read from config at each iteration so that
    config changes take effect without restarting the service.
    """
    cfg = _load_batch_cfg()
    interval: int = cfg.get("interval", 300)
    limit: int = cfg.get("limit", 100)
    logger.info(
        "Batch converter task starting (interval=%ds, limit=%d)", interval, limit
    )
    while True:
        try:
            await asyncio.sleep(interval)
            # Re-read config so live changes to interval/limit are picked up.
            cfg = _load_batch_cfg()
            interval = cfg.get("interval", 300)
            limit = cfg.get("limit", 100)
            await _do_batch_convert(limit)
        except asyncio.CancelledError:
            logger.info("Batch converter task shutting down.")
            break
        except Exception:
            logger.exception("Batch converter task error")


# ---------------------------------------------------------------------------
# Redis stream consumer
# ---------------------------------------------------------------------------

async def _stream_consumer() -> None:
    """
    Background task: reads from a Redis stream and renders articles.

    Message format expected on the stream:
        XADD article:render * uid <article-uid>

    Delivery semantics:
        - Permanent failures (not found, wrong mimetype) → ACK immediately.
        - Transient failures (DB error, etc.)           → do NOT ACK so the
          message stays pending and will be re-delivered on restart.
    """
    cfg = _load_redis_cfg()
    stream: str = cfg["stream"]
    group: str = cfg["group"]
    consumer: str = cfg["consumer"]

    client = aioredis.from_url(cfg["url"])
    session_factory = get_session_factory()

    logger.info(
        "Redis stream consumer starting (stream=%s, group=%s, consumer=%s)",
        stream, group, consumer,
    )

    while True:
        try:
            # Create the consumer group if it does not exist yet.
            try:
                await client.xgroup_create(stream, group, id="0", mkstream=True)
            except aioredis.ResponseError:
                pass  # BUSYGROUP — group already exists

            messages = await client.xreadgroup(
                group, consumer, {stream: ">"}, count=10, block=5000
            )
        except asyncio.CancelledError:
            logger.info("Redis stream consumer shutting down.")
            break
        except Exception:
            logger.exception("Redis error, retrying in 1 s")
            await asyncio.sleep(1)
            continue

        if not messages:
            continue

        for _stream_name, entries in messages:
            for entry_id, fields in entries:
                uid_raw = fields.get(b"uid") or fields.get("uid")
                if not uid_raw:
                    logger.warning("Entry %s: missing 'uid' field, skipping", entry_id)
                    await client.xack(stream, group, entry_id)
                    continue

                uid_str = uid_raw.decode() if isinstance(uid_raw, bytes) else uid_raw
                try:
                    uid = uuid.UUID(uid_str)
                except ValueError:
                    logger.warning(
                        "Entry %s: invalid uid '%s', skipping", entry_id, uid_str
                    )
                    await client.xack(stream, group, entry_id)
                    continue

                try:
                    async with session_factory() as session:
                        await _render_article(uid, session)
                    await client.xack(stream, group, entry_id)
                    logger.info("Rendered article %s (entry %s)", uid, entry_id)
                except (ArticleNotFoundError, UnsupportedMimetypeError) as e:
                    # Permanent failure — no point retrying.
                    logger.warning("Skipping entry %s: %s", entry_id, e)
                    await client.xack(stream, group, entry_id)
                except Exception:
                    # Transient failure — leave message pending for re-delivery.
                    logger.exception(
                        "Failed to render article %s (entry %s), will retry on restart",
                        uid, entry_id,
                    )

    await client.aclose()


# ---------------------------------------------------------------------------
# App lifecycle
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_engine()
    consumer_task = asyncio.create_task(_stream_consumer())

    batch_task = None
    if _load_batch_cfg().get("enabled", True):
        batch_task = asyncio.create_task(_batch_converter_task())

    yield

    consumer_task.cancel()
    if batch_task is not None:
        batch_task.cancel()

    for task in filter(None, [consumer_task, batch_task]):
        try:
            await task
        except asyncio.CancelledError:
            pass

    await dispose_engine()


app = FastAPI(lifespan=lifespan)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


@app.get("/articles/{uid}", response_model=ArticleSchema)
async def get_article(uid: uuid.UUID, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Article).where(Article.uid == uid))
    article = result.scalars().first()
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@app.post("/articles/{uid}/render", response_model=ArticleSchema)
async def render_article(uid: uuid.UUID, session: AsyncSession = Depends(get_session)):
    try:
        return await _render_article(uid, session)
    except ArticleNotFoundError:
        raise HTTPException(status_code=404, detail="Article not found")
    except UnsupportedMimetypeError as e:
        raise HTTPException(status_code=422, detail=str(e))


@app.post("/articles/batch-render")
async def batch_render_articles():
    """Manually trigger a batch conversion of unconverted / stale articles."""
    cfg = _load_batch_cfg()
    limit: int = cfg.get("limit", 100)
    return await _do_batch_convert(limit)

