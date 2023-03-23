from datetime import datetime
from pydantic import BaseModel


class UserForm(BaseModel):
    username: str | None = None
    email: str | None = None
    password: str | None = None
    is_admin: bool | None = None
    is_disabled: bool | None = None


class ReportForm(BaseModel):
    justified: bool | None = None
    notes: str | None = None


class MessageLookup(BaseModel):
    class HistoryItem(BaseModel):
        id: int
        text: str
        send_date: datetime
        reported: bool
        profile_id: int
        
        class Config:
            orm_mode = True

    starter: HistoryItem
    history: list[HistoryItem]

    class Config:
        orm_mode = True
