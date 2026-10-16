"""Mocked unit tests: these never contact Gemini or need an API key."""
from types import SimpleNamespace
import pytest
from app.core.gemini_config import GeminiSettings, get_gemini_settings
from app.services.gemini_connection import check_connection


class FakeClient:
    def __init__(self, response=None, error=None):
        self.models = self
        self.response = response
        self.error = error
        self.received = None

    def generate_content(self, **kwargs):
        self.received = kwargs
        if self.error:
            raise self.error
        return SimpleNamespace(text=self.response)


@pytest.mark.parametrize("key,model", [("", "model"), ("key", "")])
def test_missing_configuration_does_not_make_request(key, model):
    result = check_connection(GeminiSettings(key, model), lambda _: pytest.fail("no call expected"))
    assert result.status == "not_configured" and not result.ok


def test_valid_probe_sends_only_synthetic_text():
    fake = FakeClient("Monetra AI connection verified")
    result = check_connection(GeminiSettings("secret", "test-model"), lambda _: fake)
    assert result.ok and result.status == "connected"
    assert fake.received["model"] == "test-model"
    assert "balance" not in fake.received["contents"].lower()
    assert "secret" not in fake.received["contents"]


def test_empty_response():
    result = check_connection(GeminiSettings("secret", "model"), lambda _: FakeClient(""))
    assert result.status == "empty_response" and not result.ok


class ResourceExhausted(Exception):
    pass


class PermissionDenied(Exception):
    pass


class DeadlineTimeout(Exception):
    pass


@pytest.mark.parametrize("error,status", [(ResourceExhausted("secret"), "quota_exceeded"),
                                             (PermissionDenied("secret"), "access_denied"),
                                             (DeadlineTimeout("secret"), "network_error")])
def test_errors_sanitized(error, status):
    result = check_connection(GeminiSettings("secret", "model"), lambda _: FakeClient(error=error))
    assert result.status == status and "secret" not in result.message


def test_timeout_settings_validation(monkeypatch):
    monkeypatch.setenv("GEMINI_TIMEOUT_MS", "abc")
    with pytest.raises(ValueError, match="integer"):
        get_gemini_settings()
    monkeypatch.setenv("GEMINI_TIMEOUT_MS", "5")
    with pytest.raises(ValueError, match="1000"):
        get_gemini_settings()
