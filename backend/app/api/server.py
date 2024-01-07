from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.core import config, tasks

from app.api.routes import router as api_router


def get_application():
    app = FastAPI(
        title=config.PROJECT_NAME,
        version=config.VERSION,
        docs_url="/api/docs",
        openapi_url="/api/openapi.json",
    )

    # add GZip middleware
    app.add_middleware(GZipMiddleware, minimum_size=10240)

    # add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # allows all origins
        allow_credentials=True,
        allow_methods=["*"],  # allows all methods
        allow_headers=["*"],  # allows all headers
    )

    # add event handlers
    app.add_event_handler("startup", tasks.create_start_app_handler(app))
    app.add_event_handler("shutdown", tasks.create_stop_app_handler(app))

    app.include_router(api_router, prefix=config.API_PREFIX)

    return app


app = get_application()
