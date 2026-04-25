from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.api.documents import router as documents_router

app = FastAPI(title="ShortDoc API", version="1.0.0")

app.include_router(auth_router)
app.include_router(documents_router)