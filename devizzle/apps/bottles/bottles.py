from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import true

from . import schemas, models
from devizzle import core
from devizzle.apps.auth import auth


def ensure_messaging_profile(
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


router = APIRouter(
    prefix="/bottles",
    tags=["bottles"],
    dependencies=[Depends(ensure_messaging_profile)],
)


def get_messaging_profile(
    current_user: auth.models.User = Depends(core.get_current_user),
    db: Session = Depends(core.get_db),
):
    messaging_profile = (
        db.query(models.MessagingProfile)
        .filter(models.MessagingProfile.user_id == current_user.id)
        .first()
    )

    return messaging_profile


@router.post("/send")
def send_message(
    form_data: schemas.MessageSendForm,
    messaging_profile: models.MessagingProfile = Depends(get_messaging_profile),
    db: Session = Depends(core.get_db),
):
    message = models.Message(text=form_data.message, profile_id=messaging_profile.id)
    messaging_profile.last_used = datetime.now()
    messaging_profile.sent_count += 1

    db.add(message)
    db.commit()
    db.refresh(message)
    db.refresh(messaging_profile)

    return message


@router.get("/receive")
def receive_message(
    messaging_profile: models.MessagingProfile = Depends(get_messaging_profile),
    db: Session = Depends(core.get_db),
):
    # TODO: check if last used time is today, if not, pick a new message, otherwise return nothing.

    message = (
        db.query(models.Message)
        .filter(models.Message.profile_id != messaging_profile.id)
        .filter(models.Message.reader_id == None)
        .filter(models.Message.responding_to_id == None)
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
    message.profile.reputation += 1
    messaging_profile.last_used = now
    messaging_profile.received_count += 1

    db.commit()
    db.refresh(message)
    db.refresh(messaging_profile)

    return message


@router.post("/respond")
def respond_to_message(
    message_response_form: schemas.MessageResponseForm,
    messaging_profile: models.MessagingProfile = Depends(get_messaging_profile),
    db: Session = Depends(core.get_db),
):
    response = models.Message(
        text=message_response_form.response,
        profile_id=messaging_profile.id,
        responding_to_id=message_response_form.responding_to_id,
    )

    responding_to = (
        db.query(models.Message)
        .filter(models.Message.id == message_response_form.responding_to_id)
        .first()
    )

    messaging_profile.last_used = datetime.now()
    messaging_profile.sent_count += 1
    if responding_to.profile_id != messaging_profile.id:
        responding_to.profile.reputation += 1
        responding_to.profile.received_count += 1

    db.add(response)
    db.commit()
    db.refresh(response)
    db.refresh(messaging_profile)

    return response


@router.post("/report/{message_id}", response_model=schemas.MessageReportResult)
def report_message(
    message_id: int,
    messaging_profile: models.MessagingProfile = Depends(get_messaging_profile),
    db: Session = Depends(core.get_db),
):
    message = db.query(models.Message).filter_by(id=message_id).first()
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    if (
        message.profile_id != messaging_profile.id
        and message.reader_id != messaging_profile.id
    ):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    message.reported = True
    message_report = models.Report(message_id=message.id)

    try:
        db.add(message_report)
        db.commit()
        db.refresh(message_report)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

    return message_report


@router.get("/my-messages", response_model=list[schemas.Message])
def read_my_messages(
    skip: int = 0,
    limit: int = 5,
    messaging_profile: models.MessagingProfile = Depends(get_messaging_profile),
    db: Session = Depends(core.get_db),
):
    my_messages = (
        db.query(models.Message)
        .filter(models.Message.profile_id == messaging_profile.id)
        .filter(models.Message.responding_to_id == None)
        .filter(models.Message.reported.not_in([true()]))
        .offset(skip)
        .limit(limit)
        .all()
    )

    received_messages = (
        db.query(models.Message)
        .filter(models.Message.reader_id == messaging_profile.id)
        .filter(models.Message.responding_to_id == None)
        .filter(models.Message.reported.not_in([true()]))
        .offset(skip)
        .limit(limit)
        .all()
    )

    messages = my_messages + received_messages
    return messages


@router.get("/profile")
def read_my_profile(
    messaging_profile: models.MessagingProfile = Depends(get_messaging_profile),
):
    return messaging_profile
