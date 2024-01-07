from typing import List

from fastapi import APIRouter, Depends, HTTPException, Path
from starlette.status import HTTP_404_NOT_FOUND

from app.models.path import PathPublic
from app.api.dependencies.database import get_repository
from app.db.repositories.paths import PathsRepository


router = APIRouter()


# get all typhoon paths
@router.get(
    "",
    response_model=List[PathPublic],
    name="path:get-all-typhoon-paths",
)
async def get_all_typhoon_paths(
    paths_repo: PathsRepository = Depends(get_repository(PathsRepository)),
) -> List[PathPublic]:
    return await paths_repo.get_all_typhoon_paths()


# get all typhoon paths by typhoon id
@router.get(
    "/{typhoon_id}",
    response_model=List[PathPublic],
    name="path:get-all-typhoon-paths-by-typhoon-id",
)
async def get_all_typhoon_paths_by_typhoon_id(
    typhoon_id: int = Path(..., description="The id of the typhoon to get"),
    paths_repo: PathsRepository = Depends(get_repository(PathsRepository)),
) -> List[PathPublic]:
    return await paths_repo.get_all_typhoon_paths_by_typhoon_id(typhoon_id=typhoon_id)
