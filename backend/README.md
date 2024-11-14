uvicorn src.main:app --reload


### Alembic

alembic init folder_name           : creates ini file and alembic folder

Generate metadata for the migration file by changing
 target_metadata = models.Base.metadata

alembic revision -m message      : new migration revision that needs to be filled out, has some metadata


create some change in the model and run above command
fill out the migrations

alembic upgrade revision_id          : run the enhancement
paste Revision ID from the file created

alembic downgrade -1

### Sources


### Pytest

Pytest needs RootFolder/App to work


### TA-Lib
install to usr directory and compile:
```
./configure --prefix=/usr
make
sudo make install
pip install ta-lib
```