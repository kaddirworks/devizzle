from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from devizzle.apps.auth import auth
from devizzle.apps.admin import admin
from devizzle.apps.bottles import bottles
from devizzle.settings import settings

devizzle = FastAPI(title="Devizzle")
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
