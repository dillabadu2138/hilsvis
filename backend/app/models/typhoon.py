from typing import Optional
from datetime import datetime

from app.models.core import CoreModel


class TyphoonBase(CoreModel):
    """
    All common characteristics of the Typhoon resource
    """

    typhoon_name: Optional[str]
    time_start: Optional[datetime]
    time_end: Optional[datetime]


class TyphoonInDB(TyphoonBase):
    typhoon_id: int
    typhoon_name: str
    time_start: datetime
    time_end: datetime


class TyphoonPublic(TyphoonInDB):
    pass
