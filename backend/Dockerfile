
FROM python:3.13-alpine
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
# relative to build context of docker compose
COPY . /app

WORKDIR /app
# Install TA-Lib
# Source: https://github.com/hotep-team/docker-python-ta-lib/blob/main/Dockerfile
RUN pip3 install --upgrade pip


RUN pip3 install -r requirements.txt


# relative to workdir
ENTRYPOINT ["sh", "entrypoint.sh"]
