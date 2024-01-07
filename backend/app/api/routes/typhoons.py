from typing import List, Union

from fastapi import APIRouter, Depends, HTTPException, Path, Query
from starlette.status import HTTP_404_NOT_FOUND

from app.models.typhoon import TyphoonPublic
from app.api.dependencies.database import get_repository
from app.db.repositories.typhoons import TyphoonsRepository


router = APIRouter()


# get all typhoons
@router.get(
    "",
    response_model=List[TyphoonPublic],
    name="typhoon:get-all-typhoon-datasets",
)
async def get_all_typhoons(
    # query param(optional)
    year: Union[int, None] = Query(
        default=None,
        description="The year of typhoon to get",
    ),
    typhoons_repo: TyphoonsRepository = Depends(get_repository(TyphoonsRepository)),
) -> List[TyphoonPublic]:
    return await typhoons_repo.get_all_typhoons(year=year)
