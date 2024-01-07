from typing import List

from fastapi import APIRouter, Depends, HTTPException, Path
from starlette.status import HTTP_404_NOT_FOUND

from app.models.variable import VariablePublic
from app.api.dependencies.database import get_repository
from app.db.repositories.variables import VariablesRepository


router = APIRouter()


# Get all variables
@router.get(
    "",
    response_model=List[VariablePublic],
    name="variables:get-all-variables",
)
async def get_all_variables(
    variables_repo: VariablesRepository = Depends(get_repository(VariablesRepository)),
) -> List[VariablePublic]:
    variables = await variables_repo.get_all_variables()

    return variables


# Get a variable by var_id
@router.get(
    "/{var_id}",
    response_model=VariablePublic,
    name="variables:get-a-variable-by-var-id",
)
async def get_variable_by_var_id(
    var_id: int = Path(..., description="The id of the variable to get"),
    variables_repo: VariablesRepository = Depends(get_repository(VariablesRepository)),
) -> VariablePublic:
    variable = await variables_repo.get_variable_by_var_id(var_id=var_id)

    if not variable:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="아이디에 해당하는 변수가 없습니다.",
        )

    return variable


# Get all available variables by dataset_id
@router.get(
    "/dataset/{dataset_id}",
    response_model=List[VariablePublic],
    name="variables:get-all-variables-by-dataset-id",
)
async def get_all_variables_by_dataset_id(
    dataset_id: int = Path(..., description="The id of the dataset to get"),
    variables_repo: VariablesRepository = Depends(get_repository(VariablesRepository)),
) -> List[VariablePublic]:
    variables = await variables_repo.get_all_variables_by_dataset_id(dataset_id=dataset_id)

    return variables
