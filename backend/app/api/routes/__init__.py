from fastapi import APIRouter

from app.api.routes.categories import router as categories_router
from app.api.routes.datasets import router as datasets_router
from app.api.routes.variables import router as variables_router
from app.api.routes.datas import router as datas_router
from app.api.routes.typhoons import router as typhoons_router
from app.api.routes.paths import router as paths_router
from app.api.routes.characteristics import router as characteristics_router
from app.api.routes.tidal_currents import router as tidal_currents_router

router = APIRouter()

# router.include_router(categories_router, prefix="/category", tags=["위험사례(재현): 데이터셋 카테고리"])
router.include_router(datasets_router, prefix="/dataset", tags=["위험사례(재현): 데이터셋 속성"])
router.include_router(variables_router, prefix="/variable", tags=["위험사례(재현): 변수 속성"])
router.include_router(datas_router, prefix="/data", tags=["위험사례(재현): 데이터"])
router.include_router(typhoons_router, prefix="/typhoon", tags=["위험사례(관측): 태풍 데이터셋"])
router.include_router(paths_router, prefix="/path", tags=["위험사례(관측): 태풍 경로 데이터"])
router.include_router(characteristics_router, prefix="/characteristic", tags=["해역특성"])
router.include_router(tidal_currents_router, prefix="/tidal_current", tags=["해양상태: 최강 창·낙조류"])
