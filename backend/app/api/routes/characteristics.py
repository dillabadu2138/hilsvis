from fastapi import APIRouter, Depends, HTTPException, Path, Response
from starlette.status import HTTP_404_NOT_FOUND

from app.api.dependencies.database import get_repository
from app.db.repositories.characteristics import CharacteristicsRepository

from enum import Enum


class SchemaName(str, Enum):
    characteristics_accidents = "characteristics_accidents"
    characteristics_routes = "characteristics_routes"
    characteristics_zones = "characteristics_zones"


class TableName(str, Enum):
    # accidents
    kcg_nonship_accidents = "kcg_nonship_accidents"
    kcg_ship_accidents = "kcg_ship_accidents"
    kmst_ship_accidents = "kmst_ship_accidents"
    # routes
    all_routes = "all_routes"
    designated_routes = "designated_routes"
    passenger_ship_routes = "passenger_ship_routes"
    twoway_route_parts = "twoway_route_parts"
    yacht_routes = "yacht_routes"
    ais_based_passenger_ship_routes = "ais_based_passenger_ship_routes"
    # zones
    aids_to_navigation_areas = "aids_to_navigation_areas"
    forecast_coastal_areas = "forecast_coastal_areas"
    forecast_regional_areas = "forecast_regional_areas"
    forecast_kma_nearshore_areas = "forecast_kma_nearshore_areas"
    traffic_safety_designated_areas = "traffic_safety_designated_areas"
    tss_boundaries = "tss_boundaries"
    tss_zones = "tss_zones"


router = APIRouter()


# get geojson by schema and table name
@router.get(
    "/schema/{schema_name}/table/{table_name}",
    name="characteristic:get-geojson-by-schema-and-table",
    response_class=Response,
    responses={
        200: {
            "content": {"application/json": {}},
        }
    },
)
async def get_geojson_by_schema_and_table(
    schema_name: SchemaName = Path(..., description="The name of schema to get"),
    table_name: TableName = Path(..., description="The name of table to get"),
    characteristics_repo: CharacteristicsRepository = Depends(get_repository(CharacteristicsRepository)),
):
    data = await characteristics_repo.get_geojson_by_schema_and_table(
        schema_name=schema_name,
        table_name=table_name,
    )

    if not data:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="조건에 해당하는 데이터가 없습니다.",
        )

    return data[0]
