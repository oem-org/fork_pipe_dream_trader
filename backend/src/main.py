import logging
import logging.config
import os
from contextlib import asynccontextmanager
from pathlib import Path

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI
from pytz import utc

from .routers.files.FileSyncerService import FileSyncer


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
#import ssl
        
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
#ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
#ssl_context.load_cert_chain('/etc/ssl/cert/fullchain.pem', keyfile='/etc/ssl/cert/privkey.pem')

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


@app.get("/api/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "message": "FastAPI is running"}
