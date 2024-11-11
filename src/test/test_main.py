from fastapi.testclient import TestClient
from ..main import app
from fastapi import status

client = TestClient(app)

def test_check():
    assert client is not None

# def test_return_health_check():
#     response = client.get("/healthy")
#     assert response.status_code == status.HTTP_200_OK
#     assert response.json() == {'status': 'Healthy'}
#
#
def test_allowed_host():
    response = client.get("/healthy", headers={"Host": "localhost"})
    assert response.status_code == 200  # Assuming 200 is the expected status code

def test_disallowed_host():
    response = client.get("/healthy", headers={"Host": "malicious.com"})
    assert response.status_code == 400  # Disallowed host should return a 400 Bad Request

