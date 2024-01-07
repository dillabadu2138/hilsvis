from typing import Optional
from datetime import datetime, timedelta

from app.models.core import CoreModel


class DatasetBase(CoreModel):
    """
    All common characteristics of the Dataset resource
    """

    dataset_name: Optional[str]
    category_id: Optional[int]
    lon_start: Optional[float]
    lon_end: Optional[float]
    lon_step: Optional[float]
    lon_num: Optional[int]
    lat_start: Optional[float]
    lat_end: Optional[float]
    lat_step: Optional[float]
    lat_num: Optional[int]
    time_start: Optional[datetime]
    time_end: Optional[datetime]
    time_step: Optional[timedelta]
    time_num: Optional[int]


class DatasetInDB(DatasetBase):
    dataset_id: int  # Not Nullable
    dataset_name: str  # Not Nullable
    category_id: int  # Not Nullable
    lon_start: float  # Not Nullable
    lon_end: float  # Not Nullable
    lon_step: float  # Not Nullable
    lon_num: int  # Not Nullable
    lat_start: float  # Not Nullable
    lat_end: float  # Not Nullable
    lat_step: float  # Not Nullable
    lat_num: int  # Not Nullable
    time_start: datetime  # Not Nullable
    time_end: datetime  # Not Nullable
    time_step: timedelta  # Not Nullable
    time_num: int  # Not Nullable


class DatasetPublic(DatasetInDB):
    pass
