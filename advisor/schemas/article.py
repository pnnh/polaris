import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ArticleSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    uid: uuid.UUID
    title: str
    header: str
    body: str
    create_time: datetime
    update_time: datetime
    keywords: str | None = None
    description: str | None = None
    status: int
    cover: str | None = None
    owner: uuid.UUID
    channel: uuid.UUID | None = None
    discover: int
    partition: uuid.UUID | None = None
    version: str | None = None
    build: str | None = None
    url: str | None = None
    branch: str | None = None
    commit: str | None = None
    commit_time: datetime | None = None
    relative_path: str | None = None
    repo_id: uuid.UUID | None = None
    lang: str | None = None
    name: str
    checksum: str | None = None
    syncno: str | None = None
    repo_first_commit: str | None = None
    mimetype: str | None = None
    content: str | None = None
    styles: str | None = None
    convert_time: datetime | None = None
