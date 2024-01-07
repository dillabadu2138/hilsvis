from typing import Optional
from datetime import datetime

from app.models.core import CoreModel


class PathBase(CoreModel):
    """
    All common characteristics of the Path resource
    """

    typhoon_id: Optional[int]
    datetime: Optional[datetime]
    lat: Optional[float]
    lon: Optional[float]
    kma_pres: Optional[int]  # Nullable
    kma_wind: Optional[int]  # Nullable
    kma_r15: Optional[int]  # Nullable
    kma_grade: Optional[str]  # Nullable


class PathInDB(PathBase):
    path_id: int
    typhoon_id: int
    datetime: datetime
    lat: float
    lon: float


class PathPublic(PathInDB):
    pass
