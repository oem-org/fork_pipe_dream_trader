FROM python:3.13-slim-bullseye
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
# relative to build context of docker compose
COPY . /app

WORKDIR /app
RUN ls -la

RUN pip3 install --upgrade pip

RUN pip3 install -r requirements.txt
RUN pip3 install -r sqa-requirements.txt
RUN rm -rf /tmp
# relative to workdir
ENTRYPOINT ["sh", "entrypoint.sh"]
