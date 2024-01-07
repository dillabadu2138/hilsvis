from typing import Optional
from datetime import datetime

from app.models.core import CoreModel


class TidalCurrentBase(CoreModel):
    """
    All common characteristics of the TidalCurrent resource
    """

    obj_id: Optional[str]
    cur_dir: Optional[float]
    cat_ts: Optional[str]
    cur_spd: Optional[float]
    latitude: Optional[float]
    longitude: Optional[float]
    ref_tidal_station: Optional[str]
    start_datetime: Optional[datetime]
    end_datetime: Optional[datetime]
    usage: Optional[str]


class TidalCurrentInDB(TidalCurrentBase):
    obj_id: str
    cur_dir: float
    cat_ts: str
    cur_spd: float
    latitude: float
    longitude: float
    ref_tidal_station: str
    start_datetime: datetime
    end_datetime: datetime
    usage: str


class TidalCurrentPublic(TidalCurrentInDB):
    pass
