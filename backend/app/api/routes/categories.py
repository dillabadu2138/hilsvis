from typing import List

from fastapi import APIRouter, Depends, HTTPException, Path
from starlette.status import HTTP_404_NOT_FOUND

from app.models.category import CategoryPublic
from app.api.dependencies.database import get_repository
from app.db.repositories.categories import CategoriesRepository


router = APIRouter()


# 모든 카테고리 조회
@router.get(
    "/",
    response_model=List[CategoryPublic],
    name="category:get-all-categories",
)
async def get_all_categories(
    categories_repo: CategoriesRepository = Depends(get_repository(CategoriesRepository)),
) -> List[CategoryPublic]:
    return await categories_repo.get_all_categories()


# 카테고리 아이디별 카테고리 조회
@router.get(
    "/{category_id}",
    response_model=CategoryPublic,
    name="category:get-category-by-id",
)
async def get_category_by_id(
    category_id: int = Path(..., description="The id of the category to get"),
    categories_repo: CategoriesRepository = Depends(get_repository(CategoriesRepository)),
) -> CategoryPublic:
    category = await categories_repo.get_category_by_id(category_id=category_id)

    if not category:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="아이디에 해당하는 카테고리가 없습니다.",
        )

    return category
