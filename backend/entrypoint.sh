#!/bin/sh
# run time enviroment
case "$RTE" in
    dev )
        export DATABASE_URL=postgresql://user:pass@postgres:5432/db
        echo "** Development mode."
	cat /etc/ssl/certs/privkey.pem
	cat /etc/ssl/certs/privkey.pem
	cat /etc/ssl/certs/privkey.pem
	cat /etc/ssl/certs/privkey.pem
	cat /etc/ssl/certs/privkey.pem
	ls /app/certs/privkey.pem
        alembic upgrade head && uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload --ssl-keyfile /app/certs/privkey.pem --ssl-certfile /app/certs/fullchain.pem
;;
    test )
        pytest
        # pip-audit || exit 1
        ;;

    prod )
        echo "** Production mode."
        ;;
    command )
        echo "** Command mode."
        ;;
esac
