from typing import Optional

from app.models.core import CoreModel


class CategoryBase(CoreModel):
    """
    All common characteristics of the Category resource
    """

    category_name: Optional[str]


class CategoryInDB(CategoryBase):
    category_id: int
    category_name: str


class CategoryPublic(CategoryInDB):
    pass
