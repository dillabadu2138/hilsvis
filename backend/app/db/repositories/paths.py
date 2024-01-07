from typing import List

from app.db.repositories.base import BaseRepository
from app.models.path import PathInDB

GET_ALL_TYPHOON_PATHS_QUERY = """
    SELECT * FROM cases_observations.paths;
"""


GET_ALL_TYPHOON_PATHS_BY_TYPHOON_ID_QUERY = """
    SELECT
        paths.path_id, 
        paths.typhoon_id,
        paths.datetime,
        paths.lat,
        paths.lon,
        paths.kma_pres,
        paths.kma_wind,
        paths.kma_r15,
        paths.kma_grade
    FROM cases_observations.paths
    INNER JOIN cases_observations.typhoons ON typhoons.typhoon_id = paths.typhoon_id
    WHERE 
        typhoons.typhoon_id = :typhoon_id;
"""


class PathsRepository(BaseRepository):
    """
    All database actions associated with the Path resource
    """

    # get all typhoon paths
    async def get_all_typhoon_paths(self) -> List[PathInDB]:
        records = await self.db.fetch_all(
            query=GET_ALL_TYPHOON_PATHS_QUERY,
        )

        return [PathInDB(**l) for l in records]

    # get all typhoon paths by typhoon_id
    async def get_all_typhoon_paths_by_typhoon_id(
        self,
        *,
        typhoon_id: int,
    ) -> List[PathInDB]:
        records = await self.db.fetch_all(
            query=GET_ALL_TYPHOON_PATHS_BY_TYPHOON_ID_QUERY,
            values={"typhoon_id": typhoon_id},
        )

        return [PathInDB(**l) for l in records]
