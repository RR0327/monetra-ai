from datetime import datetime
import re
from pydantic import BaseModel, Field, model_validator

PASSWORD_REQUIREMENTS = (
    "Password must be 8-128 characters and include an uppercase letter, "
    "a lowercase letter, a number, and a special character."
)


class RegisterCredentials(BaseModel):
    username: str = Field(min_length=3, max_length=30, pattern=r"^[A-Za-z0-9_]+$")
    email: str = Field(min_length=5, max_length=320, pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    password: str = Field(min_length=8, max_length=128)
    confirm_password: str = Field(min_length=8, max_length=128)

    @model_validator(mode="after")
    def validate_password(self):
        if any(char.isspace() for char in self.password):
            raise ValueError("Password must not contain spaces.")
        if not re.search(r"[A-Z]", self.password):
            raise ValueError(PASSWORD_REQUIREMENTS)
        if not re.search(r"[a-z]", self.password):
            raise ValueError(PASSWORD_REQUIREMENTS)
        if not re.search(r"\d", self.password):
            raise ValueError(PASSWORD_REQUIREMENTS)
        if not re.search(r"[^A-Za-z0-9]", self.password):
            raise ValueError(PASSWORD_REQUIREMENTS)
        if self.password != self.confirm_password:
            raise ValueError("Password and confirm password must match.")
        if self.username.casefold() in self.password.casefold():
            raise ValueError("Password must not contain your username.")
        return self


class LoginCredentials(BaseModel):
    identifier: str = Field(min_length=3, max_length=320)
    password: str = Field(min_length=8, max_length=128)


class UserOut(BaseModel):
    id: int
    username: str | None
    email: str
    created_at: datetime


class AuthOut(BaseModel):
    token: str
    user: UserOut
