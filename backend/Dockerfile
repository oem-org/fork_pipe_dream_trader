
# Pandas TA require older version python
FROM python:3.11.9-bookworm
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
# relative to build context of docker compose
COPY . /app

WORKDIR /app
RUN pip3 install --upgrade pip

RUN pip3 install -r /app/src/requirements.txt

RUN apt install git
RUN pip install -U git+https://github.com/twopirllc/pandas-ta.git@development

# relative to workdir
ENTRYPOINT ["sh", "entrypoint.sh"]
