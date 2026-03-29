import uuid
from datetime import datetime

from sqlalchemy import Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Article(Base):
    __tablename__ = "articles"
    __table_args__ = {"schema": "community"}

    uid: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(128), nullable=False)
    header: Mapped[str] = mapped_column(String(64), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    create_time: Mapped[datetime] = mapped_column(nullable=False, server_default=func.now())
    update_time: Mapped[datetime] = mapped_column(nullable=False, server_default=func.now())
    keywords: Mapped[str | None] = mapped_column(String(128))
    description: Mapped[str | None] = mapped_column(String(512))
    status: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    cover: Mapped[str | None] = mapped_column(String(256))
    owner: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    channel: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))
    discover: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    partition: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))
    version: Mapped[str | None] = mapped_column(String(64))
    build: Mapped[str | None] = mapped_column(String(64))
    url: Mapped[str | None] = mapped_column(String(256))
    branch: Mapped[str | None] = mapped_column(String(64))
    commit: Mapped[str | None] = mapped_column(String(64))
    commit_time: Mapped[datetime | None] = mapped_column()
    relative_path: Mapped[str | None] = mapped_column(String(2048))
    repo_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))
    lang: Mapped[str | None] = mapped_column(String(8))
    name: Mapped[str] = mapped_column(String(256), nullable=False, default="")
    checksum: Mapped[str | None] = mapped_column(String(512))
    syncno: Mapped[str | None] = mapped_column(String(64))
    repo_first_commit: Mapped[str | None] = mapped_column(String(96))
    mimetype: Mapped[str | None] = mapped_column(String(256))
    content: Mapped[str | None] = mapped_column(Text)
    styles: Mapped[str | None] = mapped_column(Text)
    convert_time: Mapped[datetime | None] = mapped_column()
