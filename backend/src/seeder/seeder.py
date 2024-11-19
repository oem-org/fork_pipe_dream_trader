from sqlalchemy import event
from ..models.users import User
from ..models.strategies import Strategies
# Database initial data
INITIAL_DATA = {
      'users': [
            {
                  'username': 'superuser',
                  'email': 'superuser@example.com',
                  'hashed_password': hash_password('123')
            },
            {
                  'username': 'admin',
                  'email': 'admin@example.com',
                  'hashed_password': hash_password('123')
            }
      ],
      'sometable': [
            {'column1': 'value', 'column2': 'value'}
      ]
}

def initialize_table(target, connection, **kw):
    tablename = str(target)
    if tablename in INITIAL_DATA and len(INITIAL_DATA[tablename]) > 0:
        connection.execute(target.insert(), INITIAL_DATA[tablename])

# In main.py

# This method receives a table, a connection and inserts data to that table.
event.listen(User.__table__, 'after_create', initialize_table)
event.listen(SomeTable.__table__, 'after_create', initialize_table)

