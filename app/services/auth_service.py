from datetime import datetime, timezone
import uuid

from app.core.security import create_access_token, hash_password, verify_password
from app.storage.memory import tokens_store, users_store


class AuthService:
    @staticmethod
    def utc_now() -> str:
        return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    @staticmethod
    def generate_user_id() -> str:
        return f"user_{uuid.uuid4().hex[:12]}"

    async def register(self, email: str, nickname: str, password: str) -> dict | None:
        normalized_email = email.lower().strip()

        for user in users_store.values():
            if user["email"] == normalized_email:
                return None

        user_id = self.generate_user_id()
        now = self.utc_now()

        user = {
            "id": user_id,
            "email": normalized_email,
            "nickname": nickname,
            "password_hash": hash_password(password),
            "created_at": now,
        }

        users_store[user_id] = user

        return self.to_user_dto(user)

    async def login(self, email: str, password: str) -> dict | None:
        normalized_email = email.lower().strip()

        user = None
        for item in users_store.values():
            if item["email"] == normalized_email:
                user = item
                break

        if user is None:
            return None

        if not verify_password(password, user["password_hash"]):
            return None

        token = create_access_token()
        tokens_store[token] = user["id"]

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": self.to_user_dto(user),
        }

    async def get_user_by_token(self, token: str) -> dict | None:
        user_id = tokens_store.get(token)
        if user_id is None:
            return None

        user = users_store.get(user_id)
        if user is None:
            return None

        return self.to_user_dto(user)

    @staticmethod
    def to_user_dto(user: dict) -> dict:
        return {
            "id": user["id"],
            "email": user["email"],
            "nickname": user["nickname"],
            "created_at": user["created_at"],
        }


auth_service = AuthService()