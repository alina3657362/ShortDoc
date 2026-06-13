from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    nickname: str = Field(min_length=2, max_length=50)
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UpdateUserRequest(BaseModel):
    nickname: Optional[str] = Field(default=None, min_length=2, max_length=50)
    current_password: Optional[str] = Field(default=None, min_length=1, max_length=128)
    new_password: Optional[str] = Field(default=None, min_length=8, max_length=128)


class UserDto(BaseModel):
    id: str
    email: EmailStr
    nickname: str
    created_at: str


class UserResponse(BaseModel):
    user: UserDto


class RegisterResponse(BaseModel):
    user: UserDto


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserDto
