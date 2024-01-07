from typing import List

from app.db.repositories.base import BaseRepository
from app.models.tidal_current import TidalCurrentInDB

GET_ALL_TIDAL_CURRENTS_QUERY = """
    SELECT * FROM conditions.tidal_currents;
"""


class TidalCurrentsRepository(BaseRepository):
    """
    All database actions associated with the TidalCurrent resource
    """

    # get all tidal currents
    async def get_all_tidal_currents(self) -> List[TidalCurrentInDB]:
        records = await self.db.fetch_all(
            query=GET_ALL_TIDAL_CURRENTS_QUERY,
        )

        return [TidalCurrentInDB(**l) for l in records]
