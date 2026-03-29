from typing import Optional

from fastapi import Header, HTTPException


async def require_authorization(
    authorization: Optional[str] = Header(default=None),
) -> str:
    if authorization is None:
        raise HTTPException(
            status_code=401,
            detail={
                "error": {
                    "code": "UNAUTHORIZED",
                    "message": "Authorization header is required",
                }
            },
        )

    return authorization