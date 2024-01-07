from app.db.repositories.base import BaseRepository


class CharacteristicsRepository(BaseRepository):
    """
    All database actions associated with the Characteristic resource
    """

    # get characteristic by schema and table name
    async def get_geojson_by_schema_and_table(
        self,
        *,
        schema_name: str,
        table_name: str,
    ):
        record = await self.db.fetch_all(
            query=f"SELECT json_build_object('type', 'FeatureCollection', 'features', json_agg(ST_AsGeoJson(t.*)::json)) FROM  {schema_name}.{table_name} AS t;",
        )

        if not record:
            return None

        return record[0]
