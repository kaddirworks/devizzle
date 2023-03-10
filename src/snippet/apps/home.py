from fastapi import APIRouter

router = APIRouter(prefix="", tags=["home"])


@router.get("/")
def home():
    return {"message": "Hello, world!"}
