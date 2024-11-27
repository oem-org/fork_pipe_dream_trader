from fastapi import FastAPI
import datetime
from .database import SessionLocal, engine
from .exceptions import register_all_errors
from .middleware.register_middleware import register_middleware
from .models import Base
from .routers.auth import auth
from .routers.strategies import strategies
from .routers.users import users
from .seeders.coins_seeder import coins_seeder
from .seeders.indicators_seeder import indicators_seeder
from .seeders.user_seeder import users_seeder
from contextlib import asynccontextmanager
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from pytz import utc
import psycopg2


from config import Config

scheduler = AsyncIOScheduler(timezone=utc)
# Function to establish a synchronous connection to TimescaleDB


def refresh_views():
    now = datetime.datetime.now()  # Get the current system time
    print(f"Current minute: {now.minute}")
    conn = get_timescale_connection()

    with conn.cursor() as cursor:
        try:
            if now.minute % 5 == 0:
                    # 5 minute timeseries is a aggregate of the 1minute view
                    cursor.execute("REFRESH MATERIALIZED VIEW ohlc_data_1minute;")
                    cursor.execute("REFRESH MATERIALIZED VIEW ohlc_data_5minute;")
            else:
                    cursor.execute("REFRESH MATERIALIZED VIEW ohlc_data_1minute;")
            conn.commit()
        except Exception as e:
            conn.rollback()
            print(f"Error occurred: {e}")
        finally:
            conn.close()

@asynccontextmanager
async def lifespan(app: FastAPI): 
    scheduler.start()
    yield
    scheduler.shutdown()


app = FastAPI(lifespan=lifespan)


# Example of calling the function to refresh materialized views
@scheduler.scheduled_job('cron', minute="*")
async def fetch_current_time():
    refresh_views()

def startup_tasks():
    try:
        with SessionLocal() as session:

            coins_seeder(session)  # Run the coin seeding process
            indicators_seeder(session)

    except Exception as e:
        print(f"Error during startup seeding: {e}")

# Add the startup event handler
app.add_event_handler("startup", startup_tasks)




@app.get("/healthy")
def health_check():
    return {"status": "Healthy"}


register_all_errors(app)
register_middleware(app)

app.include_router(auth.router)
app.include_router(strategies.router)
app.include_router(users.router)
