from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # GCP
    GCP_PROJECT_ID: str = "your-gcp-project-id"
    GCP_LOCATION: str = "us-central1"
    GOOGLE_MAPS_API_KEY: str = ""
    GOOGLE_APPLICATION_CREDENTIALS: str = ""

    # MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "tripstellar"

    # JWT
    JWT_SECRET_KEY: str = "change-this-secret-key"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 1440

    # CORS
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000"

    # Debug
    DEBUG: bool = True

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
