import logging
import logging.config
import os
from contextlib import asynccontextmanager
from pathlib import Path

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI
from pytz import utc


from .middleware.register_middleware import register_middleware
from .models import *
from .orm_connection import SessionLocal, engine
from .routers.auth import auth
from .routers.files import files
from .routers.indicators import indicators
from .routers.timeseries import timeseries
from .routers.strategies import strategies
from .routers.users import users
from .seeders.indicators_seeder import indicators_seeder
# custom logging setup
# from .logger import logger
from .utils.sync_file_paths import sync_file_paths
from .indicators.Ao import Ao
from .dependencies import user_dependency
import json


current_directory = Path(__file__).parent
parent_folder = current_directory.parent


session = SessionLocal()
scheduler = AsyncIOScheduler(timezone=utc)
Base.metadata.create_all(bind=engine)



@asynccontextmanager
async def lifespan(app: FastAPI):
    sync_file_paths(session)
    indicators_seeder(session)
    scheduler.start()
    yield
    scheduler.shutdown()


app = FastAPI(lifespan=lifespan)


@app.on_event("startup")
async def startup_event():
    app.state.user_cache = {}  # Initialize cache in the app state



# @scheduler.scheduled_job('cron', minute="*")
# async def fetch_current_time():
#    print("cron")


def startup_tasks():
    try:
        print("seeding")
        indicators_seeder(session)
    except Exception as e:
        print(f"Error during startup seeding: {e}")


app.add_event_handler("startup", startup_tasks)

# register_all_errors(app)
register_middleware(app)

app.include_router(auth.router)
app.include_router(strategies.router)
app.include_router(users.router)
app.include_router(files.router)
app.include_router(indicators.router)
app.include_router(timeseries.router)


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "message": "FastAPI is running"}
