from pydantic import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///./app.db"

    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    smtp_sender_address: str
    smtp_sender_name: str
    smtp_username: str
    smtp_password: str
    smtp_host: str
    smtp_port: int = 587

    class Config:
        env_file = ".env"


settings = Settings()
