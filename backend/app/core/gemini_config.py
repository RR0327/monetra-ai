"""Server-side Gemini settings: no key is sent to the frontend."""
import os
from dataclasses import dataclass
from pathlib import Path
from dotenv import load_dotenv

# Load only the backend-local dotenv. Existing shell environment wins.
load_dotenv(Path(__file__).resolve().parents[2] / ".env", override=True)

@dataclass(frozen=True)
class GeminiSettings:
    api_key: str
    model: str
    timeout_ms: int = 15000


def get_gemini_settings() -> GeminiSettings:
    key = os.getenv("GEMINI_API_KEY", "").strip()
    model = os.getenv("GEMINI_MODEL", "").strip()
    raw_timeout = os.getenv("GEMINI_TIMEOUT_MS", "15000").strip()
    try:
        timeout = int(raw_timeout)
    except ValueError as exc:
        raise ValueError("GEMINI_TIMEOUT_MS must be an integer") from exc
    if not 1000 <= timeout <= 120000:
        raise ValueError("GEMINI_TIMEOUT_MS must be 1000–120000")
    return GeminiSettings(api_key=key, model=model, timeout_ms=timeout)
