from fastapi import FastAPI

from snippet.apps import home
from snippet.apps.auth import auth

snippet = FastAPI()
snippet.mount("/auth", auth.app)
snippet.mount("/", home.app)
