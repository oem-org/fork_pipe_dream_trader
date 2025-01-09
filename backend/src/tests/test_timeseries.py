import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from unittest.mock import MagicMock
from ..main import app
from ..dependencies import get_db, user_dependency
from ..models import Strategies, StrategyIndicators, Files
from ..orm_connection import Base
# Mock database setup
DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create mock database tables
@pytest.fixture(scope="module", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

# Mock database dependency
@pytest.fixture
def db_session():
    session = TestingSessionLocal()
    yield session
    session.close()

# Override FastAPI dependency
@pytest.fixture
def client(db_session):
    def mock_get_db():
        yield db_session

    def mock_user_dependency():
        return {"username": "testuser", "id": 1}

    app.dependency_overrides[get_db] = mock_get_db
    app.dependency_overrides[user_dependency] = mock_user_dependency
    return TestClient(app)


