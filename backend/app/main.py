import time
import webbrowser

import uvicorn
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from app import config
from app.utilities.logger import logger

from .models import F
from .routers.auth import auth
from .routers.todos import todos
from .routers.utils import utils

app = FastAPI(
    title=config.app_title,
    docs_url="/",
    description=config.app_description,
    version=config.app_version,
    openapi_prefix=config.settings.root_path,
    root_path=config.settings.root_path,
)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=[
        "http://localhost",
        "http://localhost:3000",
        "http://localhost:8000",
        "https://scripts.cisco.com",
        "https://cloudsso.cisco.com",
    ],
)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next: F) -> Response:
    """
    Add API process time in response headers and log calls/exceptions
    """
    if config.settings.environment == "dev" or config.settings.ci:
        request.__dict__["scope"]["headers"].append(
            (b"x-user", config.settings.local_user.encode())
        )

    start_time = time.time()
    response: Response = await call_next(request)
    process_time = str(round(time.time() - start_time, 3))
    response.headers["X-Process-Time"] = process_time
    response.headers["X-User"] = request.headers.get("x-user") or "anonymous"

    if "api-status" not in request.url.path and request.method != "OPTIONS":
        logger.info(
            "API=%s User=%s Method=%s Path=%s StatusCode=%s ProcessTime=%s",  # noqa: E501
            config.app_name,
            response.headers.get("X-User"),
            request.method,
            request.url.path,
            response.status_code,
            process_time,
        )

    return response


app.include_router(
    auth.router,
    prefix="/v1/auth",
    tags=["auth"],
)
app.include_router(
    todos.router,
    prefix="/v1/todos",
    tags=["todos"],
)
app.include_router(
    utils.router,
    prefix="/v1/utils",
    tags=["utils"],
)


if __name__ == "__main__":
    webbrowser.open("http://localhost:8000")
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        log_level="debug",
        reload=True,
    )
