from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from . import schemas, models
from devizzle import core
from devizzle.apps.auth import auth


def ensure_user_is_admin(
    current_user: auth.models.User = Depends(core.get_current_user),
):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to do that.",
            headers={"WWW-Authenticate": "Bearer"},
        )


router = APIRouter(
    prefix="/admin", tags=["admin"], dependencies=[Depends(ensure_user_is_admin)]
)


@router.post("/create-user", response_model=auth.schemas.User)
def create_user(
    user_update_form: schemas.UserForm,
    db: Session = Depends(core.get_db),
):
    user = auth.models.User(
        username=user_update_form.username,
        email=user_update_form.email,
        hashed_password=auth.hash_password(user_update_form.password),
        is_admin=user_update_form.is_admin,
        is_disabled=user_update_form.is_disabled,
    )

    try:
        db.add(user)
        db.commit()
        db.refresh(user)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not create that user! Please check the provided information.",
        )

    return user


@router.put("/user/{user_id}", response_model=auth.schemas.User)
def update_user(
    user_id: int,
    user_update_form: schemas.UserForm,
    db: Session = Depends(core.get_db),
):
    user = db.query(auth.models.User).filter(auth.models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not find that user!",
        )

    if user_update_form.username:
        user.username = user_update_form.username
    if user_update_form.email:
        user.email = user_update_form.email
    if user_update_form.password:
        user.hashed_password = auth.hash_password(user_update_form.password)
    if user_update_form.is_admin != None:
        user.is_admin = user_update_form.is_admin
    if user_update_form.is_disabled != None:
        user.is_disabled = user_update_form.is_disabled
    user.last_update = datetime.now()

    db.commit()

    return user


@router.get("/users", response_model=list[auth.schemas.User])
def list_users(
    skip: int = 0,
    limit: int = 5,
    db: Session = Depends(core.get_db),
):
    return db.query(auth.models.User).offset(skip).limit(limit).all()


@router.post("/users", response_model=list[auth.schemas.User])
def search_users(
    username: str = None,
    email: str = None,
    is_admin: bool = None,
    is_disabled: bool = None,
    reg_date_min: datetime = None,
    reg_date_max: datetime = None,
    skip: int = 0,
    limit: int = 5,
    db: Session = Depends(core.get_db),
):
    if username is None:
        username = ""
    if email is None:
        email = ""
    if reg_date_min is None:
        reg_date_min = datetime.fromtimestamp(0)
    if reg_date_max is None:
        reg_date_max = datetime.now()

    query = (
        db.query(auth.models.User)
        .filter(auth.models.User.username.startswith(username))
        .filter(auth.models.User.email.startswith(email))
        .filter(auth.models.User.reg_date.between(reg_date_min, reg_date_max))
    )

    if is_admin is not None:
        query = query.filter(auth.models.User.is_admin == is_admin)
    if is_disabled is not None:
        query = query.filter(auth.models.User.is_disabled == is_disabled)

    return query.offset(skip).limit(limit).all()
