from typing import List

from app.db.repositories.base import BaseRepository
from app.models.category import CategoryInDB


GET_ALL_CATEGORIES_QUERY = """
    SELECT category_id, category_name
    FROM cases_hindcasts.categories;
"""


GET_CATEGORY_BY_ID_QUERY = """
    SELECT category_id, category_name
    FROM cases_hindcasts.categories
    WHERE category_id = :category_id;
"""


class CategoriesRepository(BaseRepository):
    """
    All database actions associated with the Category resource
    """

    # 모든 카테고리 조회
    async def get_all_categories(self) -> List[CategoryInDB]:
        records = await self.db.fetch_all(
            query=GET_ALL_CATEGORIES_QUERY,
        )

        return [CategoryInDB(**l) for l in records]

    # 카테고리 아이디별 카테고리 조회
    async def get_category_by_id(self, *, category_id: int) -> CategoryInDB:
        record = await self.db.fetch_one(
            query=GET_CATEGORY_BY_ID_QUERY,
            values={"category_id": category_id},
        )

        if not record:
            return None

        return CategoryInDB(**record)
