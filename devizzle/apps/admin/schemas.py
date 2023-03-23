from datetime import datetime
from pydantic import BaseModel


class UserForm(BaseModel):
    username: str | None = None
    email: str | None = None
    password: str | None = None
    is_admin: bool | None = None
    is_disabled: bool | None = None
