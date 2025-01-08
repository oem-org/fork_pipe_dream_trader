
# Pandas TA require older version python
FROM python:3.11.9-bookworm
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
# relative to build context of docker compose
COPY . /app

WORKDIR /app
# Install TA-Lib
# Source: https://github.com/hotep-team/docker-python-ta-lib/blob/main/Dockerfile
RUN pip3 install --upgrade pip
# Copy SSL files into the container
COPY /etc/letsencrypt/live/mrqdt.xyz/privkey.pem .
COPY /etc/letsencrypt/live/mrqdt.xyz/fullchain.pem .


# Set permissions for the SSL files
RUN chmod 600 privkey.pem && \
    chmod 600 fullchain.pem


# RUN apt-get install gcc g++ make curl

RUN pip3 install -r /app/src/requirements.txt

RUN apt install git
RUN pip install -U git+https://github.com/twopirllc/pandas-ta.git@development

# relative to workdir
ENTRYPOINT ["sh", "entrypoint.sh"]
