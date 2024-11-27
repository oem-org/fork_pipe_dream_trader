from fastapi import FastAPI

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
app = FastAPI()

Base.metadata.create_all(bind=engine)

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
