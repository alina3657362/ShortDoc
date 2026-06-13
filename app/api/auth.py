from fastapi import APIRouter, Depends, HTTPException, status

from app.core.deps import require_authorization
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    UpdateUserRequest,
    UserResponse,
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


@router.get(
    "/me",
    response_model=UserResponse,
    responses={401: {"model": ErrorResponse}},
)
async def get_current_user(
        current_user: dict = Depends(require_authorization),
):
    return {"user": current_user}


@router.patch(
    "/me",
    response_model=UserResponse,
    responses={
        400: {"model": ErrorResponse},
        401: {"model": ErrorResponse},
    },
)
async def update_current_user(
        payload: UpdateUserRequest,
        current_user: dict = Depends(require_authorization),
):
    if (
            payload.nickname is None
            and payload.current_password is None
            and payload.new_password is None
    ):
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "EMPTY_UPDATE",
                    "message": "At least one field must be provided",
                }
            },
        )

    if (payload.current_password is None) != (payload.new_password is None):
        raise HTTPException(
            status_code=400,
            detail={
                "error": {
                    "code": "PASSWORD_FIELDS_REQUIRED",
                    "message": "Both current_password and new_password must be provided",
                }
            },
        )

    user = await auth_service.update_user(
        user_id=current_user["id"],
        nickname=payload.nickname,
        current_password=payload.current_password,
        new_password=payload.new_password,
    )

    if user is None:
        raise HTTPException(
            status_code=401,
            detail={
                "error": {
                    "code": "INVALID_CURRENT_PASSWORD",
                    "message": "Current password is invalid",
                }
            },
        )

    return {"user": user}