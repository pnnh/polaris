from pathlib import Path

import yaml
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

_engine = None
_session_factory: async_sessionmaker[AsyncSession] | None = None


def _load_dsn() -> str:
    config_path = Path(__file__).parent / "config" / "config.yaml"
    with config_path.open() as f:
        cfg = yaml.safe_load(f)
    return cfg["database"]["dsn"]


def init_engine() -> None:
    global _engine, _session_factory
    dsn = _load_dsn()
    _engine = create_async_engine(dsn, echo=False)
    _session_factory = async_sessionmaker(_engine, expire_on_commit=False)


async def dispose_engine() -> None:
    if _engine is not None:
        await _engine.dispose()


def get_session_factory() -> async_sessionmaker[AsyncSession]:
    """Return the module-level session factory (must be called after init_engine)."""
    if _session_factory is None:
        raise RuntimeError("Database engine has not been initialized yet.")
    return _session_factory


async def get_session():
    """FastAPI dependency: yields an AsyncSession per request."""
    async with _session_factory() as session:
        yield session
