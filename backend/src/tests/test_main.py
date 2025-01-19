from fastapi import status
from fastapi.testclient import TestClient
from passlib.context import CryptContext
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker

from ..config import Config
from ..dependencies import get_db
from ..main import app
from ..orm_connection import Base
from ..routers.auth.auth_utils import get_current_user

client = TestClient(app)

headers = {"Host": "localhost"}


def mock_get_current_user():
    # Return a mock authenticated user
    return {'username': 'test', 'id': 1}


bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

testengine = create_engine(
    Config.DATABASE_URL,
)

# create seperate database session for testing
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=testengine)

Base.metadata.create_all(bind=testengine)


def mock_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Override the real dependency with the mock
app.dependency_overrides[get_current_user] = mock_get_current_user
app.dependency_overrides[get_db] = mock_get_db


def test_health_check():
    """"""
    response = client.get("/api/health")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"status": "ok", "message": "FastAPI is running"}


def test_cors_allowed_origin():
    """ensure CORS headers are set for allowed origins."""
    allowed_origin = "http://localhost:5173"
    response = client.get(
        "/api/health",
        headers={"Origin": allowed_origin},
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.headers.get("access-control-allow-origin") == allowed_origin


def test_cors_disallowed_origin():
    """ensure CORS headers are not set for disallowed origins."""
    disallowed_origin = "http://disallowed-origin.com"
    response = client.get(
        "/api/health",
        headers={"Origin": disallowed_origin},
    )
    assert response.status_code == status.HTTP_200_OK
    assert "access-control-allow-origin" not in response.headers
