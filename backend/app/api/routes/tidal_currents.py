from typing import List

from fastapi import APIRouter, Depends, HTTPException, Path
from starlette.status import HTTP_404_NOT_FOUND

from app.models.tidal_current import TidalCurrentPublic
from app.api.dependencies.database import get_repository
from app.db.repositories.tidal_currents import TidalCurrentsRepository


router = APIRouter()


# get all tidal currents
@router.get(
    "",
    response_model=List[TidalCurrentPublic],
    name="tidal-current:get-all-tidal-currents",
)
async def get_all_tidal_currents(
    tidal_currents_repo: TidalCurrentsRepository = Depends(get_repository(TidalCurrentsRepository)),
) -> List[TidalCurrentPublic]:
    return await tidal_currents_repo.get_all_tidal_currents()
