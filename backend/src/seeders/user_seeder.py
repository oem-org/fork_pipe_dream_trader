from sqlalchemy.orm import Session

from ..models import Users
from ..services.auth.auth_services import hash_password

INITIAL_DATA = {
    "users": [
        {
            "username": "superuser",
            "email": "superuser@example.com",
            "hashed_password": hash_password("Hej123!"),
        },
        {
            "username": "admin",
            "email": "admin@example.com",
            "hashed_password": hash_password("Hej123!"),
        },
    ]
}

def users_seeder(session: Session):
    new_users = 0
    flag = True  

    try:
        for user_data in INITIAL_DATA["users"]:
            username = user_data["username"]
            email = user_data["email"]

            existing_user = (
                session.query(Users)
                .filter((Users.username == username) | (Users.email == email))
                .first()
            )

            if not existing_user:
                new_user = Users(
                    username=username,
                    email=email,
                    hashed_password=user_data["hashed_password"],
                )
                session.add(new_user)
                new_users += 1
                flag = False
                print(f"Added new user: {username}")
            else:
                print(f"User already exists: {username}")

        session.commit()

        if flag:
            print("No new users inserted.")
        else:
            print(f"Created {new_users} users in the database.")

    except Exception as e:
        print(f"Error in user seeder: {e}")
        session.rollback()
