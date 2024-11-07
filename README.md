uvicorn StrategyApp.main:app --reload


### Alembic

alembic init folder_name           : creates ini file and alembic folder

alembic revision -m message      : new revision of enviroment
create some change in the model and run above command
fill out the migrations

alembic upgrade revision_id          : run the enhancement
paste Revision ID from the file created

alembic downgrade -1            

