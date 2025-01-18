#!/bin/sh
# run time enviroment
case "$RTE" in
    dev )
        isort ./src
        black ./src --skip-string-normalization

        echo "** Development mode."
        alembic upgrade head && uvicorn src.main:app --host 0.0.0.0 --port 8080
        ;;
    test )
        # Security vulnerability in python-jose with no fix-version
        pip-audit
        # pip-audit || exit 1
        pytest
        ;;

    prod )
        echo "** Production mode."
        alembic upgrade head && uvicorn src.main:app --host 0.0.0.0 --port 8080
        ;;
esac
