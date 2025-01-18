from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from .config import Config

engine = create_engine(Config.DATABASE_URL)

# autocommit = false to enable rollbacks
# autoflush = True will flush pending changes to the database before running a query
SessionLocal = sessionmaker(autocommit=False, autoflush=True, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Any SQLAlchemy model will inherit from this base class
Base = declarative_base()
