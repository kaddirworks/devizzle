import argparse
from devizzle.database import SessionLocal
from devizzle.apps.auth import auth

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("username")
    parser.add_argument("email")
    parser.add_argument("password")
    parser.add_argument("--admin", action="store_true")
    parser.add_argument("--disabled", action="store_true")
    args = parser.parse_args()

    db = SessionLocal()
    user = auth.models.User(
        username=args.username,
        hashed_password=auth.hash_password(args.password),
        email=args.email,
        is_admin=args.admin,
        is_disabled=args.disabled,
    )

    try:
        db.add(user)
        db.commit()
        print(f"User {args.username} added successfully!")
    except Exception as e:
        print(e)

    db.close()
