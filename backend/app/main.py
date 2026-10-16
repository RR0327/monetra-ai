"""Monetra AI FastAPI application."""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.health import router as health_router
from app.api.v1.transactions import router as transactions_router
from app.api.v1.finance import router as finance_router
from app.api.v1.prediction import router as prediction_router
from app.api.v1.bills import router as bills_router
from app.api.v1.simulation import router as simulation_router
from app.api.v1.assistant import router as assistant_router
from app.core.database import initialize_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_database()
    yield

app = FastAPI(title="Monetra AI API", version="0.7.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False, allow_methods=["*"], allow_headers=["*"])
app.include_router(health_router, prefix="/api/v1")
app.include_router(transactions_router, prefix="/api/v1")
app.include_router(finance_router, prefix="/api/v1")

app.include_router(prediction_router, prefix="/api/v1")

app.include_router(bills_router, prefix="/api/v1")
app.include_router(simulation_router, prefix="/api/v1")

app.include_router(assistant_router, prefix="/api/v1")
