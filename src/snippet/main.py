from fastapi import FastAPI

from snippet.core.auth import auth
from snippet.apps import home

snippet = FastAPI()
snippet.mount("/auth", auth.app)
snippet.mount("/", home.app)
