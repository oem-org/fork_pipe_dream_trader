from fastapi import FastAPI
from .models import Base
from .database import engine
from .routers import auth, strategies, admin, users
from .exceptions import register_all_errors
app = FastAPI()

Base.metadata.create_all(bind=engine)


@app.get("/healthy")
def health_check():
    return {'status': 'Healthy'}

register_all_errors(app)

app.include_router(auth.router)
app.include_router(strategies.router)
app.include_router(admin.router)
app.include_router(users.router)
