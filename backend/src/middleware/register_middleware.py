import logging
import time

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.requests import Request
from fastapi.responses import JSONResponse

logger = logging.getLogger("uvicorn.access")
# custom made logger so disabled
logger.disabled = True


# beyond crud youtube
def register_middleware(app: FastAPI):

    @app.middleware("http")
    async def custom_logging(request: Request, call_next):
        start_time = time.time()

        response = await call_next(request)
        processing_time = time.time() - start_time

        # custom logging to cli
        message = f"{request.client.host}:{request.client.port} - {request.method} - {request.url.path} - {response.status_code} completed after {processing_time}s"

        print(message)
        return response

    origins = [
        "http://localhost:5173",
       # "http://www.mrqdt.xyz",
       # "http://www.mrqdt.xyz/",
        "https://www.mrqdt.xyz",
        "https://mrqdt.xyz",
       # "http://mrqdt.xyz",
       # "http://mrqdt.xyz/",
        "http://localhost:5174",
        "http://localhost:8000",
        "http://localhost:8080",
        "http://localhost:8080/docs",
    ]

    # app.add_middleware(HTTPSRedirectMidVdleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=True,
    )

    # app.add_middleware(
    #     TrustedHostMiddleware,
    #     allowed_hosts=["localhost", "127.0.0.1", "0.0.0.0"],
    # )
