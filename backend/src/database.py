from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import Config



engine = create_engine(
    Config.DATABASE_URL
)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# any SQLAlchemy model will inherit from this base class
Base = declarative_base()


def get_timescale_connection():
    conn = psycopg2.connect(Config.TIMESCALE_DATABASE_URL)
    return conn
