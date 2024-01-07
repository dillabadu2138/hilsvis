from typing import Optional

from app.models.core import CoreModel


class VariableBase(CoreModel):
    """
    All common characteristics of the Variable resource
    """

    dataset_id: Optional[int]
    var_name: Optional[str]
    var_long_name: Optional[str]
    var_standard_name: Optional[str]
    var_units: Optional[str]


class VariableInDB(VariableBase):
    var_id: int  # Not Nullable
    dataset_id: int  # Not Nullable
    var_name: str  # Not Nullable


class VariablePublic(VariableInDB):
    pass
