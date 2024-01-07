from typing import List

from fastapi import APIRouter, Depends, HTTPException, Path, Response
from starlette.status import HTTP_404_NOT_FOUND

from app.api.dependencies.database import get_repository
from app.db.repositories.datas import DatasRepository


router = APIRouter()


# Raster data selection for a specific time (As WKB)
@router.get(
    "/wkb/{dataset_id}/var/{var_name}/time/{time_id}",
    name="datawkb:get-data-for-a-specific-time",
    response_class=Response,
    responses={
        200: {
            "content": {"application/octet-stream": {}},
            "description": "Return a binary data",
        }
    },
)
async def get_data_wkb_for_a_specific_time(
    dataset_id: int = Path(..., description="The id of the dataset to get"),
    var_name: str = Path(..., description="The name of variable to get"),
    time_id: int = Path(..., description="The id of the time to get", ge=1),
    datas_repo: DatasRepository = Depends(get_repository(DatasRepository)),
):
    data = await datas_repo.get_data_wkb_for_a_specific_time(
        dataset_id=dataset_id,
        var_name=var_name,
        time_id=time_id,
    )

    if not data:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="조건에 해당하는 데이터가 없습니다.",
        )

    return Response(content=data, media_type="application/octet-stream")


# Raster data selection for a specific time (As PNG)
# @router.get(
#     "/png/{dataset_id}/var/{var_name}/time/{time_id}",
#     name="datapng:get-data-for-a-specific-time",
#     response_class=Response,
#     responses={
#         200: {
#             "content": {"image/png": {}},
#             "description": "Return an image",
#         }
#     },
# )
# async def get_data_png_for_a_specific_time(
#     dataset_id: int = Path(..., description="The id of the dataset to get"),
#     var_name: str = Path(..., description="The name of variable to get"),
#     time_id: int = Path(..., description="The id of the time to get", ge=1),
#     datas_repo: DatasRepository = Depends(get_repository(DatasRepository)),
# ):
#     data = await datas_repo.get_data_png_for_a_specific_time(
#         dataset_id=dataset_id,
#         var_name=var_name,
#         time_id=time_id,
#     )

#     if not data:
#         raise HTTPException(
#             status_code=HTTP_404_NOT_FOUND,
#             detail="조건에 해당하는 데이터가 없습니다.",
#         )

#     return Response(content=data, media_type="image/png")
