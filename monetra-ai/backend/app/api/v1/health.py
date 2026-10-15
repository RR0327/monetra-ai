from fastapi import APIRouter

router = APIRouter(tags=["System"])


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "project": "Monetra AI", "version": "0.1.0"}
