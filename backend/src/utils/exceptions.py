import logging
from typing import Any


from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError


def handle_db_error(
    exception: Exception, detail: str = "Database operation failed"
) -> None:
    logging.error(f"{detail}: {str(exception)}")  # Log the error for debugging
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=f"{detail}: {str(exception)}",
    )


def handle_not_validated_file_error(detail, errors: Any) -> None:
    raise HTTPException(
        status_code=422,
        detail={
            "message": detail,
            "errors": errors
        }
    )

def handle_not_found_error(detail: str) -> None:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=detail,
    )

def handle_bad_request_error(exception: Exception, detail: str) -> None:
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"{detail}: {str(exception)}",
    )

