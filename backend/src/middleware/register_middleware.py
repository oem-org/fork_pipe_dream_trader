import logging
import time
from urllib.parse import urlunparse

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.requests import Request
from fastapi.responses import JSONResponse, RedirectResponse

logger = logging.getLogger("uvicorn.access")
# custom made logger so disabled
logger.disabled = False


# source: beyond crud youtube
def register_middleware(app: FastAPI):

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

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=True,
    )
