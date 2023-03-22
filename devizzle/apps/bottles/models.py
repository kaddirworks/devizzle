from datetime import datetime

from sqlalchemy import Integer, Column, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from devizzle.core.auth import models
from devizzle.database import Base


class MessagingProfile(Base):
    __tablename__ = "messaging_profiles"

    id = Column(Integer, primary_key=True, index=True)
    date_created = Column(DateTime, default=datetime.now)
    last_used = Column(DateTime, default=datetime.now)

    sent_count = Column(Integer, default=0)
    received_count = Column(Integer, default=0)
    reputation = Column(Integer, default=0)

    user_id = Column(ForeignKey(models.User.id), nullable=False, unique=True)
    user = relationship(models.User)


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    send_date = Column(DateTime, default=datetime.now)
    read_date = Column(DateTime, default=None, nullable=True)

    profile_id = Column(ForeignKey("messaging_profiles.id"), nullable=False)
    profile = relationship("MessagingProfile", foreign_keys=[profile_id])

    reader_id = Column(ForeignKey("messaging_profiles.id"), nullable=True, default=None)
    reader = relationship("MessagingProfile", foreign_keys=[reader_id])

    responses = relationship("Message", back_populates="responding_to")

    responding_to_id = Column(ForeignKey("messages.id"), nullable=True, default=None)
    responding_to = relationship(
        "Message", back_populates="responses", remote_side=[id]
    )
