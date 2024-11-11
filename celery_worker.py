import time

from celery import Celery
from src.config import Config


celery = Celery(__name__)
celery.conf.broker_url = Config.CELERY_BROKER_URL
celery.conf.result_backend = Config.CELERY_RESULT_BACKEND


@celery.task(name="create_task")
def create_task(a, b, c):
    time.sleep(a)
    return b + c
