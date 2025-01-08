import pytest
from fastapi import status
from fastapi.testclient import TestClient
from passlib.context import CryptContext
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker
import numpy as np
import pandas as pd
from ..orm_connection import Base
from ..dependencies import get_db
from ..main import app
from ..models import Strategies, Users
from ..routers.auth.auth_utils import get_current_user
from ..config import Config

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
    response = client.get("/health")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"status": "ok", "message": "FastAPI is running"}



# Create a test DataFrame
dftest = {
    'A': [1.0, 2.0, 3.0, 4.0],
    'B': [0.9, 1.9, 2.9, 3.9],
    'C': [0.8, 1.8, 1.8, 2.8],
    'D': [0.7, 1.7, 1.7, 1.7],
    'E': [100.5, 106.0, 102.5, 111.5],
    'HIGH': [9994.5, 9996.0, 9992.5, 9991.5],
    'Z': [0, 0, 0, 0],
}

tdf = pd.DataFrame(dftest)

# Expressions to evaluate
expressions = {
    "expression": "(tdf.A > tdf.B & tdf.C > tdf.D) & tdf.B < 2",  # Expected: True for row 0gg
    "expression2": "(tdf.A > tdf.B & tdf.C > tdf.D) & ~(tdf.B == 1.9)",  # Expected: False for row 1
    "expression3": "(tdf.A > tdf.B & tdf.C > tdf.D) & ~(tdf.B == 0.9 | tdf.C == 1.8)",  # Expected: False for row 0
    "expression4": "(tdf.A > tdf.B & tdf.C > tdf.D) & tdf.B > 0.1",  # Expected: True for row 0, 2, and 3
    "expression5": "(tdf.A > tdf.B & tdf.C < tdf.D) & ~(tdf.B < 0.1)",  # Expected: False for all rows
}

# Apply expressions
tdf['test_test'] = np.where(pd.eval(expressions['expression']), 1, -1)
tdf['test_test2'] = np.where(pd.eval(expressions['expression2']), 1, -1)
tdf['test_test3'] = np.where(pd.eval(expressions['expression3']), 1, -1)
tdf['test_test4'] = np.where(pd.eval(expressions['expression4']), 1, -1)
tdf['test_test5'] = np.where(pd.eval(expressions['expression5']), 1, -1)

# Expected results for each test
expected_results = {
    'test_test': [1, -1, -1, -1],  # Expression 1: Expected True for row 0, False for others
    'test_test2': [-1, -1, -1, -1],  # Expression 2: Expected False for row 1
    'test_test3': [-1, -1, -1, -1],  # Expression 3: Expected False for row 0
    'test_test4': [1, -1, 1, 1],     # Expression 4: Expected True for rows 0, 2, and 3
    'test_test5': [-1, -1, -1, -1],  # Expression 5: Expected False for all rows
}

# Now let's create pytest tests for each of the expressions

@pytest.mark.parametrize("column, expected_values", expected_results.items())
def test_expressions(column, expected_values):
    """
    Test that checks if the expression results match the expected values for each column.
    """
    # Run the tests
    for i, expected in enumerate(expected_values):
        assert tdf[column][i] == expected, f"Failed for {column} at index {i}, expected {expected}, got {tdf[column][i]}"

