# from sqlalchemy.orm import Session
# from sqlalchemy import create_engine
# from app.models import Base  # Import your Base from where it's defined
# from app.database import engine  # Import the engine you're using
#
# def drop_all_tables():
#     """Drops all database tables."""
#     try:
#         print("Dropping all tables...")
#         Base.metadata.drop_all(bind=engine)
#         print("All tables dropped successfully.")
#     except Exception as e:
#         print(f"An error occurred while dropping tables: {e}")
#
# if __name__ == "__main__":
#     drop_all_tables()
