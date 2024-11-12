FROM python:3.13-slim-bullseye
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

COPY . /app

WORKDIR /app

RUN pip3 install --upgrade pip

RUN pip3 install -r requirements.txt
RUN rm -rf /tmp

ENTRYPOINT ["sh", "entrypoint.sh"]
