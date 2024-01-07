from typing import List, BinaryIO

from app.db.repositories.base import BaseRepository


GET_SINGLE_DATA_WKB_QUERY = """
    SELECT
        ST_AsBinary(datas.rast)
    FROM cases_hindcasts.datas
    INNER JOIN cases_hindcasts.datasets ON datasets.dataset_id = datas.dataset_id
    INNER JOIN cases_hindcasts.variables ON variables.var_id = datas.var_id
    WHERE 
        datasets.dataset_id = :dataset_id AND 
        variables.var_name = :var_name AND 
        datas.time_id = :time_id;
"""

GET_SINGLE_DATA_PNG_QUERY = """
    SELECT
        ST_AsPNG(ST_ColorMap(datas.rast,1,'greyscale')) As png 
    FROM cases_hindcasts.datas
    INNER JOIN cases_hindcasts.datasets ON datasets.dataset_id = datas.dataset_id
    INNER JOIN cases_hindcasts.variables ON variables.var_id = datas.var_id
    WHERE 
        datasets.dataset_id = :dataset_id AND 
        variables.var_name = :var_name AND 
        datas.time_id = :time_id;
"""


class DatasRepository(BaseRepository):
    """
    All database actions associated with the Variable resource
    """

    # Raster data selection for a specific time (As WKB)
    async def get_data_wkb_for_a_specific_time(
        self,
        *,
        dataset_id: int,
        var_name: str,
        time_id: int,
    ):
        record = await self.db.fetch_one(
            query=GET_SINGLE_DATA_WKB_QUERY,
            values={
                "dataset_id": dataset_id,
                "var_name": var_name,
                "time_id": time_id,
            },
        )

        if not record:
            return None

        return record[0]

    # Raster data selection for a specific time (As PNG)
    async def get_data_png_for_a_specific_time(
        self,
        *,
        dataset_id: int,
        var_name: str,
        time_id: int,
    ) -> BinaryIO:
        record = await self.db.fetch_one(
            query=GET_SINGLE_DATA_PNG_QUERY,
            values={
                "dataset_id": dataset_id,
                "var_name": var_name,
                "time_id": time_id,
            },
        )

        if not record:
            return None

        return record[0]
