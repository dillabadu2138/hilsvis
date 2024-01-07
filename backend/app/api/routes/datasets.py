from typing import List, Union

from fastapi import APIRouter, Depends, HTTPException, Path, Query
from starlette.status import HTTP_404_NOT_FOUND

from app.models.dataset import DatasetPublic
from app.api.dependencies.database import get_repository
from app.db.repositories.datasets import DatasetsRepository


router = APIRouter()


# Get all dataset
@router.get(
    "",
    response_model=List[DatasetPublic],
    name="dataset:get-all-datasets",
)
async def get_all_datasets(
    skip: int = 0,
    limit: int = 500,
    category_name: Union[str, None] = Query(
        default=None,
        description="The name of the category to get",
    ),
    datasets_repo: DatasetsRepository = Depends(get_repository(DatasetsRepository)),
) -> List[DatasetPublic]:
    datasets = await datasets_repo.get_all_datasets(
        category_name=category_name,
    )

    return datasets[skip : skip + limit]


# Get dataset by id
@router.get(
    "/{dataset_id}",
    response_model=DatasetPublic,
    name="dataset:get-dataset-by-id",
)
async def get_dataset_by_id(
    dataset_id: int = Path(..., description="The id of the dataset to get"),
    datasets_repo: DatasetsRepository = Depends(get_repository(DatasetsRepository)),
) -> DatasetPublic:
    dataset = await datasets_repo.get_dataset_by_id(dataset_id=dataset_id)

    # check if it exists
    if not dataset:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="아이디에 해당하는 데이터셋이 없습니다.",
        )

    return dataset
