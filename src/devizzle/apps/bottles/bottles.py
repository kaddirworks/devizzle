from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from . import schemas, models
from devizzle.core import core
from devizzle.core.auth import auth


router = APIRouter(prefix="/bottles", tags=["bottles"])


def get_messaging_profile(
    current_user: auth.models.User = Depends(core.get_current_user),
    db: Session = Depends(core.get_db),
):
    messaging_profile = (
        db.query(models.MessagingProfile)
        .filter(models.MessagingProfile.user_id == current_user.id)
        .first()
    )
    if not messaging_profile:
        messaging_profile = models.MessagingProfile(user_id=current_user.id)
        db.add(messaging_profile)
        db.commit()
        db.refresh(messaging_profile)

    return messaging_profile


@router.post("/send")
def send_message(
    form_data: schemas.MessageSendForm,
    messaging_profile: models.MessagingProfile = Depends(get_messaging_profile),
    db: Session = Depends(core.get_db),
):
    message = models.Message(text=form_data.message, profile_id=messaging_profile.id)
    messaging_profile.last_used = datetime.now()

    db.add(message)
    db.commit()
    db.refresh(message)

    return schemas.MessageSendResult()


@router.get("/receive")
def receive_message(
    messaging_profile: models.MessagingProfile = Depends(get_messaging_profile),
    db: Session = Depends(core.get_db),
):
    # TODO: check if last used time is today, if not, pick a new message, otherwise return nothing.

    message = (
        db.query(models.Message)
        .filter(models.Message.profile != messaging_profile)
        .filter(models.Message.reader == None)
        .filter(models.Message.responding_to == None)
        .first()
    )
    if not message:
        raise HTTPException(
            status_code=status.HTTP_204_NO_CONTENT,
            detail="We could not find any messages.",
        )

    now = datetime.now()

    message.read_date = now
    message.reader_id = messaging_profile.id
    messaging_profile.last_used = now
    db.commit()
    db.refresh(message)

    return schemas.MessageReceived(message=message.text, send_date=message.send_date)


@router.post("/respond")
def respond_to_message(
    message_response_form: schemas.MessageResponseForm,
    messaging_profile: models.MessagingProfile = Depends(get_messaging_profile),
    db: Session = Depends(core.get_db),
):
    message_to_respond = (
        db.query(models.Message)
        .filter(models.Message.id == message_response_form.responding_to_id)
        .first()
    )

    response = models.Message(
        text=message_response_form.response,
        profile_id=messaging_profile.id,
        responding_to_id=message_response_form.responding_to_id,
    )

    db.add(response)
    db.commit()
    db.refresh(response)

    return schemas.MessageResponseResult()


@router.get("/my-messages", response_model=list[schemas.Message])
def read_my_messages(
    skip: int = 0,
    limit: int = 100,
    messaging_profile: models.MessagingProfile = Depends(get_messaging_profile),
    db: Session = Depends(core.get_db),
):
    my_messages = (
        db.query(models.Message)
        .filter(models.Message.profile_id == messaging_profile.id)
        .filter(models.Message.responding_to_id == None)
        .offset(skip)
        .limit(limit)
        .all()
    )

    received_messages = (
        db.query(models.Message)
        .filter(models.Message.reader_id == messaging_profile.id)
        .filter(models.Message.responding_to_id == None)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return my_messages + received_messages


@router.get("/profile", response_model=schemas.MessagingProfile)
def read_my_profile(
    messaging_profile: models.MessagingProfile = Depends(get_messaging_profile),
    db: Session = Depends(core.get_db),
):
    return schemas.MessagingProfile(
        date_created=messaging_profile.date_created,
        ranking=messaging_profile.ranking,
        received_count=messaging_profile.received_count,
        reputation=messaging_profile.reputation,
        sent_count=messaging_profile.sent_count,
    )
