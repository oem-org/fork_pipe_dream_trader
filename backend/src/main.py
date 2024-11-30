from fastapi import FastAPI
from .orm_connection import SessionLocal, engine
from .exceptions import register_all_errors
from .middleware.register_middleware import register_middleware
from .models import Base
from .routers.auth import auth
from .routers.strategies import strategies
from .routers.users import users
from .routers.indicators import indicators 
from .routers.files import files
from .seeders.indicators_seeder import indicators_seeder
from contextlib import asynccontextmanager
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from pytz import utc
import logging
import logging.config

scheduler = AsyncIOScheduler(timezone=utc)
session = SessionLocal()

logging.config.fileConfig("log_config.ini")
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

handler = logging.StreamHandler()
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(name)s - %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)

Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler.start()
    yield
    scheduler.shutdown()

app = FastAPI(lifespan=lifespan)

# @scheduler.scheduled_job('cron', minute="*")
# async def fetch_current_time():
#    print("cron")

def startup_tasks():
    try:
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
