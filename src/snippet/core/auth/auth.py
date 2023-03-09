import re, uuid

from datetime import datetime, timedelta

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt

from snippet.database import engine
from snippet.core.auth import models, schemas
from snippet.core import core, environment


app = FastAPI()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, key=environment.SECRET_KEY, algorithm=environment.ALGORITHM
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


@app.get("/activate/{activation_code}")
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

    access_token_expires = timedelta(minutes=environment.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        {"sub": user.username}, expires_delta=access_token_expires
    )

    return schemas.Token(access_token=access_token, token_type="bearer")


@app.post("/register")
def register(form_data: schemas.RegistrationForm, db: Session = Depends(core.get_db)):
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

    return schemas.RegistrationRequestResult(
        username=form_data.username, email=form_data.email, created_at=user.created_at
    )


@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(core.get_db)
):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=environment.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        {"sub": user.username}, expires_delta=access_token_expires
    )

    user.last_update = datetime.now()
    db.commit()

    return schemas.Token(access_token=access_token, token_type="bearer")


@app.post("/request-password-change")
def request_password_change(
    form_data: schemas.PasswordChangeRequest, db: Session = Depends(core.get_db)
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

    return schemas.PasswordChangeRequestResult(
        email=form_data.email, created_at=password_change_request.created_at
    )


@app.post("/password-change")
def password_change(
    form_data: schemas.PasswordChangeForm, db: Session = Depends(core.get_db)
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

    return schemas.PasswordChangeResult(
        email=password_change_request.email, changed_at=user.last_update
    )
