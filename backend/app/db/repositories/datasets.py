from typing import List

from app.db.repositories.base import BaseRepository
from app.models.dataset import DatasetInDB


GET_ALL_DATASETS_QUERY = """
    SELECT
        datasets.dataset_id,
        datasets.dataset_name,
        datasets.category_id,
        datasets.lon_start,
        datasets.lon_end,
        datasets.lon_step,
        datasets.lon_num,
        datasets.lat_start,
        datasets.lat_end,
        datasets.lat_step,
        datasets.lat_num,
        datasets.time_start,
        datasets.time_end,
        datasets.time_step,
        datasets.time_num
    FROM cases_hindcasts.datasets
    INNER JOIN cases_hindcasts.categories ON categories.category_id = datasets.category_id
    WHERE
        category_name=COALESCE(:category_name, category_name);
"""


GET_DATASET_BY_ID_QUERY = """
    SELECT * FROM cases_hindcasts.datasets
    WHERE dataset_id = :dataset_id;
"""


class DatasetsRepository(BaseRepository):
    """
    All database actions associated with the Dataset resource
    """

    # Get all datasets
    async def get_all_datasets(self, *, category_name) -> List[DatasetInDB]:
        # add optional query params if exist
        query_values = {}
        if category_name is not None:
            query_values.update({"category_name": category_name})

        records = await self.db.fetch_all(
            query=GET_ALL_DATASETS_QUERY,
            values=query_values,
        )

        return [DatasetInDB(**l) for l in records]

    # Get dataset by id
    async def get_dataset_by_id(self, *, dataset_id: int) -> DatasetInDB:
        record = await self.db.fetch_one(
            query=GET_DATASET_BY_ID_QUERY,
            values={"dataset_id": dataset_id},
        )

        # check if it exists
        if not record:
            return None

        return DatasetInDB(**record)
