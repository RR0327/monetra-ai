"""Read-only month-end projection and risk routes."""
from datetime import date
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.finance import Month
from app.schemas.prediction import ForecastOut
from app.services.prediction import forecast_for_month

router = APIRouter(tags=['forecast'])

@router.get('/forecast', response_model=ForecastOut)
def get_forecast(month: Month | None = Query(default=None), db: Session = Depends(get_db)):
    return forecast_for_month(db, month or date.today().strftime('%Y-%m'))
