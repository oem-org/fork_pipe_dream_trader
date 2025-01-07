#!/bin/sh
# run time enviroment
case "$RTE" in
    dev )
        export DATABASE_URL=postgresql://user:pass@postgres:5432/db
        echo "** Development mode."
        alembic upgrade head && uvicorn src.main:app --host 0.0.0.0 --port 8080 --reload
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
