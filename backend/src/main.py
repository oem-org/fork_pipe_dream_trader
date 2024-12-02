from fastapi import FastAPI
from .database import SessionLocal
from .exceptions import register_all_errors
from .middleware.register_middleware import register_middleware
from .models import Base
from .routers.auth import auth
from .routers.strategies import strategies
from .routers.users import users
from .seeders.indicators_seeder import indicators_seeder
from contextlib import asynccontextmanager
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from pytz import utc

scheduler = AsyncIOScheduler(timezone=utc)
session = SessionLocal()

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

register_all_errors(app)
register_middleware(app)

app.include_router(auth.router)
app.include_router(strategies.router)
app.include_router(users.router)
