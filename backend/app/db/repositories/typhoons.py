from typing import List

from app.db.repositories.base import BaseRepository
from app.models.typhoon import TyphoonInDB


GET_ALL_TYPHOONS_QUERY = """
    SELECT * FROM cases_observations.typhoons
    WHERE EXTRACT(year FROM time_start) = COALESCE(:year, EXTRACT(year FROM time_start));
"""


class TyphoonsRepository(BaseRepository):
    """
    All database actions associated with the Typhoon resource
    """

    # get all typhoons
    async def get_all_typhoons(
        self,
        *,
        year,
    ) -> List[TyphoonInDB]:
        # add optional query param if exists
        query_values = {}
        if year is not None:
            query_values.update({"year": year})

        records = await self.db.fetch_all(
            query=GET_ALL_TYPHOONS_QUERY,
            values=query_values,
        )

        return [TyphoonInDB(**l) for l in records]
