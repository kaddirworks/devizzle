from datetime import datetime
from pydantic import BaseModel


class MessageBase(BaseModel) :
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
