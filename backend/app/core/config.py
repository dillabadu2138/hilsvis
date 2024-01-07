from databases import DatabaseURL
from starlette.config import Config
from starlette.datastructures import Secret

PROJECT_NAME = "hilsvis"
VERSION = "1.0.0"
API_PREFIX = "/api"

# read from environment variables and/or ".env" files
config = Config(".env")

#
PG_USER = config("PG_USER", cast=str)
PG_PASSWORD = config("PG_PASSWORD", cast=Secret)
PG_HOST = config("PG_HOST", cast=str)
PG_PORT = config("PG_PORT", cast=str, default="5432")
PG_DB = config("PG_DB", cast=str)

# db connection string
DATABASE_URL = config(
    "DATABASE_URL",
    cast=DatabaseURL,
    default=f"postgresql://{PG_USER}:{PG_PASSWORD}@{PG_HOST}:{PG_PORT}/{PG_DB}",
)
