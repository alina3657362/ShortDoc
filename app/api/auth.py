from fastapi import APIRouter, HTTPException, status

from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
)
from app.schemas.common import ErrorResponse
from app.services.auth_service import auth_service

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])


@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
    responses={409: {"model": ErrorResponse}},
)
async def register(payload: RegisterRequest):
    user = await auth_service.register(
        email=payload.email,
        nickname=payload.nickname,
        password=payload.password,
    )

    if user is None:
        raise HTTPException(
            status_code=409,
            detail={
                "error": {
                    "code": "EMAIL_ALREADY_EXISTS",
                    "message": "User with this email already exists",
                }
            },
        )

    return {"user": user}


@router.post(
    "/login",
    response_model=LoginResponse,
    responses={401: {"model": ErrorResponse}},
)
async def login(payload: LoginRequest):
    result = await auth_service.login(
        email=payload.email,
        password=payload.password,
    )

    if result is None:
        raise HTTPException(
            status_code=401,
            detail={
                "error": {
                    "code": "INVALID_CREDENTIALS",
                    "message": "Invalid email or password",
                }
            },
        )

    return result