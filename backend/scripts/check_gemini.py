"""Run from backend/: python -m scripts.check_gemini"""
import json
from app.core.gemini_config import get_gemini_settings
from app.services.gemini_connection import check_connection


def main() -> int:
    try:
        result = check_connection(get_gemini_settings())
    except ValueError as exc:
        print(json.dumps({"ok": False, "status": "invalid_config", "message": str(exc)}))
        return 1
    print(json.dumps({"ok": result.ok, "status": result.status,
                      "message": result.message, "response": result.response}, ensure_ascii=False))
    return 0 if result.ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
