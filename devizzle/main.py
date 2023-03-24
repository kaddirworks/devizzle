from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from devizzle.apps.auth import auth
from devizzle.apps.admin import admin
from devizzle.apps.bottles import bottles
from devizzle.settings import settings

tags_metadata = [
    {
        "name": "auth",
        "description": "User registration, activation and authentication.",
    },
    {"name": "admin", "description": "Administration and moderation functions."},
    {"name": "bottles", "description": "Handles messaging beetween users."},
]

devizzle = FastAPI(
    title="Devizzle",
    openapi_tags=tags_metadata,
    docs_url="/debug",
    redoc_url=None,
    responses={
        500: {"description": "Could not handle request properly, please try again."}
    },
)
devizzle.include_router(auth.router)
devizzle.include_router(admin.router)
devizzle.include_router(bottles.router)

origins = [settings.allowed_origin]

devizzle.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
