from fastapi import FastAPI

from snippet.core.auth import auth
from snippet.apps import home
from snippet.apps.bottles import bottles

snippet = FastAPI()
snippet.include_router(auth.router)
snippet.include_router(bottles.router)
snippet.include_router(home.router)