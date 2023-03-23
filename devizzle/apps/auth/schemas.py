from datetime import datetime
from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    username: str
    expiration: datetime


class RegistrationForm(BaseModel):
    username: str
    email: str
    password: str


class User(BaseModel):
    id: int
    username: str
    email: str
    reg_date: datetime
    last_update: datetime
    is_admin: bool | None = None
    is_disabled: bool | None = None

    class Config:
        orm_mode = True


class StoredUser(User):
    hashed_password: str


class RegistrationRequestResult(BaseModel):
    username: str
    email: str
    created_at: datetime


class PasswordChangeRequest(BaseModel):
    """
    Sent from user to server. Server sends email to registered email address
    with secret code.
    """

    email: str


class PasswordChangeRequestResult(BaseModel):
    """
    Sent from server to user after user requests a password change.
    """

    email: str
    created_at: datetime


class PasswordChangeForm(BaseModel):
    """
    Sent from user to server, after user has a secret code.
    """

    new_password: str
    secret_code: str


class PasswordChangeResult(BaseModel):
    """
    Sent from server to user after password is successfully changed.
    """

    email: str
    changed_at: datetime
