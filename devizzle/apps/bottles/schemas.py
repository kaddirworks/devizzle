from datetime import datetime
from pydantic import BaseModel


class MessageBase(BaseModel):
    id: int
    text: str
    send_date: datetime
    profile_id: int

    class Config:
        orm_mode = True


class Message(MessageBase):
    responses: list[MessageBase] = []

    class Config:
        orm_mode = True


class MessageSendForm(BaseModel):
    message: str


class MessageResponseForm(BaseModel):
    responding_to_id: int
    response: str


class MessageReportResult(BaseModel):
    id: int
    report_date: datetime
    message_id: int

    class Config:
        orm_mode = True


class MessagingProfile(BaseModel):
    id: int
    sent_count: int
    received_count: int
    reputation: int
    user_id: int
    date_created: datetime

    class Config:
        orm_mode = True
