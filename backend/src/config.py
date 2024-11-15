from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str
    DATABASE_URL: str
    RTE: str
    model_config = SettingsConfigDict(env_file="testenv", extra="ignore")


Config = Settings()
