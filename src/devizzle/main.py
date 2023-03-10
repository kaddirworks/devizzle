from fastapi import FastAPI

from devizzle.core.auth import auth
from devizzle.apps import home
from devizzle.apps.bottles import bottles

devizzle = FastAPI(title="Devizzle")
devizzle.include_router(auth.router)
devizzle.include_router(bottles.router)
devizzle.include_router(home.router)
