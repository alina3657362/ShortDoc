import hashlib
import secrets


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    password_hash = hashlib.sha256((salt + password).encode("utf-8")).hexdigest()
    return f"{salt}${password_hash}"


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt, password_hash = stored_hash.split("$", 1)
    except ValueError:
        return False

    candidate_hash = hashlib.sha256((salt + password).encode("utf-8")).hexdigest()
    return secrets.compare_digest(candidate_hash, password_hash)


def create_access_token() -> str:
    return secrets.token_urlsafe(32)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()