from typing import List

from app.db.repositories.base import BaseRepository
from app.models.variable import VariableInDB


GET_ALL_VARIABLES_QUERY = """
    SELECT * FROM cases_hindcasts.variables;
"""


GET_VARIABLE_BY_ID_QUERY = """
    SELECT * FROM cases_hindcasts.variables
    WHERE var_id = :var_id;
"""


GET_ALL_VARIABLES_BY_DATASET_ID_QUERY = """
    SELECT
        variables.var_id,
        variables.var_name,
        variables.var_long_name,
        variables.var_standard_name,
        variables.var_units,
        variables.dataset_id
    FROM cases_hindcasts.variables
    INNER JOIN cases_hindcasts.datasets ON datasets.dataset_id = variables.dataset_id
    WHERE 
		    datasets.dataset_id = :dataset_id;
"""


class VariablesRepository(BaseRepository):
    """
    All database actions associated with the Variable resource
    """

    # Get all variables
    async def get_all_variables(self) -> List[VariableInDB]:
        records = await self.db.fetch_all(
            query=GET_ALL_VARIABLES_QUERY,
        )

        return [VariableInDB(**l) for l in records]

    # Get a variable by variable id
    async def get_variable_by_var_id(self, *, var_id: int) -> VariableInDB:
        record = await self.db.fetch_one(
            query=GET_VARIABLE_BY_ID_QUERY,
            values={"var_id": var_id},
        )

        if not record:
            return None

        return VariableInDB(**record)

    # Get all available variables by dataset_id
    async def get_all_variables_by_dataset_id(self, *, dataset_id: int) -> List[VariableInDB]:
        records = await self.db.fetch_all(
            query=GET_ALL_VARIABLES_BY_DATASET_ID_QUERY,
            values={"dataset_id": dataset_id},
        )

        return [VariableInDB(**l) for l in records]
