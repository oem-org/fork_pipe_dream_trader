from contextlib import asynccontextmanager
from pathlib import Path

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI
from pytz import utc

from .lib.services.FileSyncerService import FileSyncer


from .middleware.register_middleware import register_middleware
from .models import *
from .orm_connection import SessionLocal, engine
from .routers.auth import auth
from .routers.files import files
from .routers.indicators import indicators
from .routers.timeseries import timeseries
from .routers.strategies import strategy
from .routers.strategies import condition as strategy_condition
from .routers.strategies import indicator as strategy_indicator
from .routers.strategies import backtest as strategy_backtest
from .routers.users import users
from .seeders.indicators_seeder import indicators_seeder
# custom logging setup
# from .logger import logger

current_directory = Path(__file__).parent
parent_folder = current_directory.parent

session = SessionLocal()
scheduler = AsyncIOScheduler(timezone=utc)
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    FileSyncer.sync_file_paths(session)
    indicators_seeder(session)
    scheduler.start()
    yield
    scheduler.shutdown()

app = FastAPI(lifespan=lifespan)

@scheduler.scheduled_job('cron', hour=0, minute=0)
async def fetch_current_time():
    print("Midnight Cron job")

register_middleware(app)

app.include_router(auth.router)
app.include_router(strategy.router)
app.include_router(strategy_condition.router)
app.include_router(strategy_indicator.router)
app.include_router(strategy_backtest.router)
app.include_router(users.router)
app.include_router(files.router)
app.include_router(indicators.router)
app.include_router(timeseries.router)


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "message": "FastAPI is running"}
