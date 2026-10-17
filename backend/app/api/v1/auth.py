from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.auth import (create_session, get_current_user, hash_password,
                           normalize_email, revoke_session, verify_password)
from app.core.database import get_db
from app.models import Setting, User
from app.schemas.auth import AuthOut, LoginCredentials, RegisterCredentials, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthOut, status_code=201)
def register(payload: RegisterCredentials, db: Session = Depends(get_db)):
    email = normalize_email(payload.email)
    username = payload.username.strip()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    if db.scalar(select(User).where(User.username == username)):
        raise HTTPException(status_code=409, detail="That username is already taken")
    user = User(username=username, email=email, password_hash=hash_password(payload.password))
    db.add(user)
    db.flush()
    db.add(Setting(user_id=user.id, currency="BDT", opening_balance_paisa=0,
                   monthly_income_target_paisa=0))
    token = create_session(db, user)
    db.refresh(user)
    return {"token": token, "user": user}


@router.post("/login", response_model=AuthOut)
def login(payload: LoginCredentials, db: Session = Depends(get_db)):
    identifier = payload.identifier.strip()
    if "@" in identifier:
        user = db.scalar(select(User).where(User.email == normalize_email(identifier)))
    else:
        user = db.scalar(select(User).where(User.username == identifier))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Invalid email/username or password",
                            headers={"WWW-Authenticate": "Bearer"})
    return {"token": create_session(db, user), "user": user}


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user


@router.post("/logout", status_code=204)
def logout(request: Request, db: Session = Depends(get_db)):
    authorization = request.headers.get("authorization", "")
    if authorization.lower().startswith("bearer "):
        revoke_session(db, authorization[7:].strip())
