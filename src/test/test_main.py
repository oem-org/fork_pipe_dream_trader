from fastapi.testclient import TestClient
from ..models import Strategies, Users
import pytest
from ..dependencies import get_db
from ..main import app
from fastapi import status
from .utils import test_strategy
from ..services.auth.auth_services import get_current_user
from passlib.context import CryptContext
from sqlalchemy import create_engine, text
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker
from ..database import Base
from sqlalchemy.orm import Session

client = TestClient(app)

headers={"Host": "localhost"}


def mock_get_current_user():
    # Return a mock authenticated user
    return {'username': 'codingwithrobytest', 'id': 1, 'user_role': 'admin'}



bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


SQLALCHEMY_DATABASE_URL = "sqlite:///./testdb.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass = StaticPool,
)

# create seperate database session for testing
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def mock_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Override the real dependency with the mock
app.dependency_overrides[get_current_user] = mock_get_current_user
app.dependency_overrides[get_db] = mock_get_db

@pytest.fixture
def test_strategy():
    # Create a strategy object for testing
    strategy = Strategies(
        title="Learn to code!",
        description="Need to learn everyday!",
        priority=5,
        complete=False,
        owner_id=1,  # Link to test user
    )
    # Use the testing session to add the strategy to the database
    db = TestingSessionLocal()
    db.add(strategy)
    db.commit()
    yield strategy  # Yield the strategy object for the test to use
    # Cleanup: delete the strategy after the test
    with engine.connect() as connection:
        connection.execute(text("DELETE FROM strategy;"))
        connection.commit()

@pytest.fixture
def test_user():
    # Create a test user for authentication testing
    user = Users(
        username="codingwithrobytest",
        email="codingwithrobytest@email.com",
        first_name="Eric",
        last_name="Roby",
        hashed_password=bcrypt_context.hash("testpassword"),  # Hashed password
        role="admin",
        phone_number="(111)-111-1111"
    )
    # Add the user to the database using the testing session
    db = TestingSessionLocal()
    db.add(user)
    db.commit()
    yield user  # Yield the user object for the test to use
    # Cleanup: delete the user after the test
    with engine.connect() as connection:
        connection.execute(text("DELETE FROM users;"))
        connection.commit()


def check_user_exists(db: Session, user_id: int) -> bool:
    return db.query(Users).filter(Users.id == user_id).first() is not None

def test_check_user_exists2(test_user):
    # Test whether the user exists in the test database
    db = TestingSessionLocal()  # Create a new session
    user_exists = check_user_exists(db, test_user.id)  # Use the function to check if user exists
    db.close()  # Close the session after using it

    # Assert the user exists
    assert user_exists is True
def test_check_user_exists(test_user):
    # Test whether the user exists in the test database
    db = TestingSessionLocal()  # Create a new session
    user_exists = check_user_exists(db, test_user.id)  # Use the function to check if user exists
    db.close()  # Close the session after using it

    # Assert the user exists
    assert user_exists is True

def test_mock_get_current_user():
    user = mock_get_current_user()  # This simulates the user being logged in
    assert user["username"] == "codingwithrobytest"
    assert user["id"] == 1
    assert user["user_role"] == "admin"

def test_allowed_host():
    response = client.get("/healthy", headers={"Host": "localhost"})
    assert response.status_code == 200

def test_disallowed_host():
    response = client.get("/healthy", headers={"Host": "malicious.com"})
    assert response.status_code == 400

def test_read_all_authenticated():
    response = client.get("/", headers=headers)
    assert response.status_code == status.HTTP_200_OK
