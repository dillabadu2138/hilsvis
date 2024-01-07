from typing import Optional

from app.models.core import CoreModel


# Data as wkb
class DataWkbBase(CoreModel):
    """
    All common characteristics of the Data resource (WKB)
    """

    dataset_id: Optional[int]
    var_id: Optional[int]
    time_id: Optional[int]
    rast: Optional[bytes]


class DataWkbInDB(DataWkbBase):
    data_id: int
    dataset_id: int
    var_id: int
    time_id: int
    rast: bytes


class DataWkbPublic(DataWkbInDB):
    pass
