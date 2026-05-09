import uuid

from app.core.db import get_db_connection
from app.core.security import (
    create_access_token,
    hash_password,
    hash_token,
    verify_password,
)


class AuthService:
    @staticmethod
    def generate_user_id() -> str:
        return f"user_{uuid.uuid4().hex[:12]}"

    @staticmethod
    def generate_session_id() -> str:
        return f"sess_{uuid.uuid4().hex[:12]}"

    async def register(self, email: str, nickname: str, password: str) -> dict | None:
        normalized_email = email.lower().strip()

        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT id
                    FROM users
                    WHERE email = %s
                    """,
                    (normalized_email,),
                )
                existing_user = cursor.fetchone()

                if existing_user is not None:
                    return None

                user_id = self.generate_user_id()
                password_hash = hash_password(password)

                cursor.execute(
                    """
                    INSERT INTO users (
                        id,
                        email,
                        nickname,
                        password_hash
                    )
                    VALUES (%s, %s, %s, %s)
                    RETURNING id, email, nickname, created_at
                    """,
                    (
                        user_id,
                        normalized_email,
                        nickname,
                        password_hash,
                    ),
                )

                user = cursor.fetchone()
                connection.commit()

        return self.to_user_dto(user)

    async def login(self, email: str, password: str) -> dict | None:
        normalized_email = email.lower().strip()

        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT id, email, nickname, password_hash, created_at
                    FROM users
                    WHERE email = %s
                    """,
                    (normalized_email,),
                )
                user = cursor.fetchone()

                if user is None:
                    return None

                if not verify_password(password, user["password_hash"]):
                    return None

                access_token = create_access_token()
                access_token_hash = hash_token(access_token)
                session_id = self.generate_session_id()

                cursor.execute(
                    """
                    INSERT INTO auth_sessions (
                        id,
                        user_id,
                        access_token_hash
                    )
                    VALUES (%s, %s, %s)
                    """,
                    (
                        session_id,
                        user["id"],
                        access_token_hash,
                    ),
                )

                connection.commit()

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": self.to_user_dto(user),
        }

    async def get_user_by_token(self, token: str) -> dict | None:
        access_token_hash = hash_token(token)

        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT
                        users.id,
                        users.email,
                        users.nickname,
                        users.created_at
                    FROM auth_sessions
                    JOIN users ON users.id = auth_sessions.user_id
                    WHERE auth_sessions.access_token_hash = %s
                      AND auth_sessions.revoked_at IS NULL
                      AND (
                          auth_sessions.expires_at IS NULL
                          OR auth_sessions.expires_at > now()
                      )
                    """,
                    (access_token_hash,),
                )

                user = cursor.fetchone()

        if user is None:
            return None

        return self.to_user_dto(user)

    @staticmethod
    def to_user_dto(user: dict) -> dict:
        return {
            "id": user["id"],
            "email": user["email"],
            "nickname": user["nickname"],
            "created_at": user["created_at"].isoformat(),
        }


auth_service = AuthService()