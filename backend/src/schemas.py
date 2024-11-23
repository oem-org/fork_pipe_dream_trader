from pydantic import BaseModel

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    id: int
    username: str

class CreateUserRequest(BaseModel):
    username: str
    email: str
    password: str

class CreateUserResponse(BaseModel):
    id: str
    email: str
    username: str

class Token(BaseModel):
    access_token: str
    token_type: str
