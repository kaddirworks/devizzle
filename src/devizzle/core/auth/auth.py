import re, uuid
import smtplib, ssl, email.utils

from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt

from email.message import EmailMessage

from devizzle.core.auth import models, schemas
from devizzle.core import core
from devizzle.settings import settings


router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, key=settings.secret_key, algorithm=settings.algorithm
    )
    return encoded_jwt


def hash_password(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def authenticate_user(username: str, password: str, db: Session):
    user = core.get_user(username, db)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def check_email_validity(email: str) -> bool:
    PATTERN = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b"
    return re.match(PATTERN, email)


def generate_secret_code() -> str:
    return uuid.uuid4().hex


@router.get("/activate/{activation_code}")
def activate(activation_code: str, db: Session = Depends(core.get_db)):
    user_activation = (
        db.query(models.UserActivation)
        .filter(models.UserActivation.secret_code == activation_code)
        .first()
    )
    if not user_activation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invalid activation code."
        )

    user = models.User(
        username=user_activation.username,
        email=user_activation.email,
        hashed_password=user_activation.hashed_password,
    )

    try:
        db.add(user)
        db.delete(user_activation)
        db.commit()
        db.refresh(user)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not process your activation request. Please check if this user has already been activated.",
        )

    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        {"sub": user.username}, expires_delta=access_token_expires
    )

    expiration = datetime.utcnow() + access_token_expires
    return schemas.Token(
        access_token=access_token,
        token_type="bearer",
        username=user_activation.username,
        expiration=expiration,
    )


def send_email(receiver: str, subject: str, content: str):
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = email.utils.formataddr(
        (settings.smtp_sender_name, settings.smtp_sender_address)
    )
    msg["To"] = receiver
    msg.set_content(content)

    try:
        server = smtplib.SMTP(settings.smtp_host, settings.smtp_port)
        server.ehlo()
        server.starttls(
            context=ssl.create_default_context(
                purpose=ssl.Purpose.SERVER_AUTH, cafile=None, capath=None
            )
        )
        server.ehlo()
        server.login(settings.smtp_username, settings.smtp_password)
        server.send_message(msg, settings.smtp_sender_address, receiver)
        server.close()
    except Exception as e:
        print(f"Error: {e}")
        return False
    else:
        print("Email successfully sent!")
        return True


def send_activation_code(receiver: str, secret_code: str, username: str):
    content = (
        f"Hello, {username}.\n"
        f"This is your activation code for Devizzle. "
        f"Please click the link to activate your account.\n"
        f"{settings.allowed_origin}/activate/{secret_code}\n\n"
        f"If you dont know what this email is about, please ignore it "
        f"as it will not be sent again."
    )
    send_email(receiver, "Devizzle - Account Activation", content)


@router.post("/register")
def register(
    form_data: schemas.RegistrationForm,
    background_tasks: BackgroundTasks,
    db: Session = Depends(core.get_db),
):
    if not form_data.username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Username can not be empty."
        )

    if not form_data.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Password can not be empty."
        )

    user = (
        db.query(models.User).filter(models.User.username == form_data.username).first()
    )
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken."
        )

    if not check_email_validity(form_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid email address."
        )

    user = db.query(models.User).filter(models.User.email == form_data.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address already registered.",
        )

    hashed_password = hash_password(form_data.password)
    secret_code = generate_secret_code()
    user = models.UserActivation(
        username=form_data.username,
        email=form_data.email,
        hashed_password=hashed_password,
        secret_code=secret_code,
    )

    try:
        db.add(user)
        db.commit()
        db.refresh(user)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Could not create user."
        )

    background_tasks.add_task(
        send_activation_code,
        receiver=form_data.email,
        secret_code=secret_code,
        username=form_data.username,
    )

    return schemas.RegistrationRequestResult(
        username=form_data.username, email=form_data.email, created_at=user.created_at
    )


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(core.get_db),
):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        {"sub": user.username}, expires_delta=access_token_expires
    )

    user.last_update = datetime.now()
    db.commit()

    expiration = datetime.utcnow() + access_token_expires
    return schemas.Token(
        access_token=access_token,
        token_type="bearer",
        username=form_data.username,
        expiration=expiration,
    )


def send_password_change_code(receiver: str, secret_code: str):
    content = (
        f"Hello.\n"
        f"It seems you have requested a password change for your account. "
        f"Please click the link to proceed with changing your account's password.\n"
        f"TODO: add react route for posting the secret code and changing the password. ({secret_code})\n\n"
        f"If you dont know what this email is about, please ignore it "
        f"as it will not be sent again."
    )
    send_email(receiver, "Devizzle - Password Change", content)


@router.post("/request-password-change")
def request_password_change(
    form_data: schemas.PasswordChangeRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(core.get_db),
):
    user = db.query(models.User).filter(models.User.email == form_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user was found with this email address.",
        )

    secret_code = generate_secret_code()
    password_change_request = models.PasswordChangeRequest(
        email=form_data.email, secret_code=secret_code
    )

    try:
        db.add(password_change_request)
        db.commit()
        db.refresh(password_change_request)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not create password change request.",
        )

    background_tasks.add_task(
        send_password_change_code, receiver=form_data.email, secret_code=secret_code
    )

    return schemas.PasswordChangeRequestResult(
        email=form_data.email, created_at=password_change_request.created_at
    )


def send_password_change_confirmation(receiver: str, username: str):
    content = (
        f"Hello, {username}.\n"
        f"It seems you have changed your password a few minutes ago.\n"
        f"If you do not recognize this activity in your account please "
        f"change your password immediately or get in contact with us as "
        f"someone might have gotten access to your account."
    )
    send_email(receiver, "Devizzle - Password Change Confirmation", content)


@router.post("/password-change")
def password_change(
    form_data: schemas.PasswordChangeForm,
    background_tasks: BackgroundTasks,
    db: Session = Depends(core.get_db),
):
    password_change_request = (
        db.query(models.PasswordChangeRequest)
        .filter(models.PasswordChangeRequest.secret_code == form_data.secret_code)
        .first()
    )
    if not password_change_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Invalid code."
        )

    user = (
        db.query(models.User)
        .filter(models.User.email == password_change_request.email)
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user is registered using this email.",
        )

    user.hashed_password = hash_password(form_data.new_password)
    user.last_update = datetime.now()

    try:
        db.delete(password_change_request)
        db.commit()
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not apply all changes.",
        )

    background_tasks.add_task(
        send_password_change_confirmation,
        receiver=password_change_request.email,
        username=user.username,
    )

    return schemas.PasswordChangeResult(
        email=password_change_request.email, changed_at=user.last_update
    )
