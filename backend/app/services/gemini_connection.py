"""Independent, non-financial hosted Gemini connectivity check.

No transaction records, bank details or credentials are included in the prompt.
"""
from dataclasses import dataclass
from app.core.gemini_config import GeminiSettings


@dataclass(frozen=True)
class ConnectionResult:
    ok: bool
    status: str
    message: str
    response: str = ""


def check_connection(settings: GeminiSettings, client_factory=None) -> ConnectionResult:
    if not settings.api_key:
        return ConnectionResult(False, "not_configured", "Set GEMINI_API_KEY in backend/.env")
    if not settings.model:
        return ConnectionResult(False, "not_configured", "Set GEMINI_MODEL to a verified available model")
    try:
        if client_factory is None:
            from google import genai
            from google.genai import types
            client = genai.Client(api_key=settings.api_key, http_options=types.HttpOptions(timeout=settings.timeout_ms))
        else:
            client = client_factory(settings)
        # Intentionally do not pass user financial information to this probe.
        result = client.models.generate_content(
            model=settings.model,
            contents="Reply with exactly: Monetra AI connection verified",
        )
        reply = (getattr(result, "text", None) or "").strip()
        if not reply:
            return ConnectionResult(False, "empty_response", "Provider returned no readable text")
        # Do not assume the model always obeys exact wording.
        return ConnectionResult(True, "connected", "Hosted Gemini response received", reply[:300])
    except Exception as exc:
        # Never display raw exception details: SDK exceptions may include request identifiers
        # and provider diagnostics. Class-name classification avoids exposing credentials.
        name = type(exc).__name__.lower()
        if "resourceexhausted" in name or "ratelimit" in name or "quota" in name:
            status, message = "quota_exceeded", "Provider quota or rate limit reached; check usage and retry later"
        elif "permission" in name or "unauth" in name or "forbidden" in name:
            status, message = "access_denied", "API key, permissions, or region access could not be verified"
        elif "notfound" in name:
            status, message = "model_unavailable", "Model not found or unavailable for this API key"
        elif "timeout" in name or "connection" in name or "connect" in name:
            status, message = "network_error", "Provider connection failed or timed out"
        elif "invalidargument" in name or "badrequest" in name:
            status, message = "invalid_request", "Provider rejected the model or test request"
        else:
            status, message = "provider_unavailable", "Gemini request failed; check model, quota, network and region eligibility"
        return ConnectionResult(False, status, message)
    finally:
        if 'client' in locals() and hasattr(client, 'close'):
            try:
                client.close()
            except Exception:
                pass
