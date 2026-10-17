"""Read-only month-end projection and risk routes."""
from datetime import date
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.finance import Month
from app.schemas.prediction import ForecastOut
from app.services.prediction import forecast_for_month
from app.core.auth import get_current_user
from app.models import User

router = APIRouter(tags=['forecast'])

@router.get('/forecast', response_model=ForecastOut)
def get_forecast(month: Month | None = Query(default=None), db: Session = Depends(get_db),
                 user: User = Depends(get_current_user)):
    return forecast_for_month(db, user.id, month or date.today().strftime('%Y-%m'))
