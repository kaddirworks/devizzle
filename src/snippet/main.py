from fastapi import FastAPI

from snippet.core.auth import auth
from snippet.apps import home
from snippet.apps.bottles import bottles

from snippet.database import Base, engine

# TODO: move this responsibility to alembic
Base.metadata.create_all(bind=engine)

snippet = FastAPI()
snippet.mount("/auth", auth.app)
snippet.mount("/bottles", bottles.app)
snippet.mount("/", home.app)
