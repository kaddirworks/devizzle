from datetime import datetime
from pydantic import BaseModel


class MessageSendForm(BaseModel):
    message: str


class MessageSendResult(BaseModel):
    # TODO: maybe add some data in the future
    pass


class MessageReceived(BaseModel):
    message: str
    send_date: datetime


class MessageResponseForm(BaseModel):
    responding_to_id: int
    response: str


class MessageResponseResult(BaseModel):
    # TODO
    pass

class Message(BaseModel):
    text: str
    send_date: datetime
    responses: list["Message"]

    class Config:
        orm_mode = True
