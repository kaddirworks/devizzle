from datetime import datetime
from sqlalchemy import Integer, Column, String, DateTime, Boolean

from devizzle.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(128), unique=True, index=True)
    email = Column(String(128), unique=True, nullable=False)

    reg_date = Column(DateTime, default=datetime.now)
    last_update = Column(DateTime, default=datetime.now)

    hashed_password = Column(String(256), nullable=False)

    is_admin = Column(Boolean, default=False)
    is_disabled = Column(Boolean, default=False)


class UserActivation(Base):
    __tablename__ = "user_activations"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(128), unique=True, index=True)
    email = Column(String(128), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.now)

    hashed_password = Column(String(256), nullable=False)

    secret_code = Column(String(256), unique=True, nullable=False, index=True)


class PasswordChangeRequest(Base):
    __tablename__ = "password_change_requests"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(128), unique=True, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    secret_code = Column(String(256), unique=True, nullable=False, index=True)
