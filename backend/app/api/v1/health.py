from fastapi import APIRouter
router = APIRouter(tags=["health"])

@router.get("/health")
def health():
    return {"status": "ok", "project": "Monetra AI", "version": "0.7.0"}
