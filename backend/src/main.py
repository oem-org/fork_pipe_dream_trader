import logging
import logging.config
import os
from contextlib import asynccontextmanager
from pathlib import Path

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI
from pytz import utc

from .middleware.register_middleware import register_middleware
from .models import Base
from .orm_connection import SessionLocal, engine
from .routers.auth import auth
from .routers.files import files
from .routers.indicators import indicators
from .routers.strategies import strategies
from .routers.users import users
from .seeders.indicators_seeder import indicators_seeder
from .utils.sync_file_paths import sync_file_paths

current_directory = Path(__file__).parent
parent_folder = current_directory.parent

log_config_path = parent_folder / "log.ini"

if not log_config_path.exists():
    raise FileNotFoundError(f"Log configuration file not found: {log_config_path}")

# Configure logging
logging.config.fileConfig(log_config_path)
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Stream handler for additional logging
handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(name)s - %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)

session = SessionLocal()
scheduler = AsyncIOScheduler(timezone=utc)
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting App")
    result = sync_file_paths(session)
    indicators_seeder(session)
    scheduler.start()
    print(result)
    yield
    print("Stopping App")
    scheduler.shutdown()


app = FastAPI(lifespan=lifespan)

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


@app.get("/health", tags=["Health"])
async def health_check():
    """
    Endpoint to check if the application is running.
    """
    return {"status": "ok", "message": "FastAPI is running"}
