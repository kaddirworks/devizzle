# Devizzle

This is a simple messaging application made as a portifolio project.

## Deployment

In order to deploy you will need 3 things: a basic python installation, a `.env` file and a database server in case you dont want to use sqlite.

### Python Installation

To setup the Python environment run the following commands:

```
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 -m build
pip install dist/<NAME_OF_THE_BUILT_WHL_FILE>
```

These commands will, in this particular order: create the virtual environment `venv`, activate it, install the dependencies listen under `requirements.txt`, build the source code of the app and lastly install it.

### Example .env file

```
DATABASE_URL = "sqlite:///./app.db"

SECRET_KEY = "asdfghjklqwertyuiop"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30

SMTP_SENDER_ADDRESS = "norerply@domain.com.br"
SMTP_SENDER_NAME = "Name of Your Choice"
SMTP_USERNAME = "smtp_use123456"
SMTP_PASSWORD = "ilovecheesee"
SMTP_HOST = "some.smtp.service.com"
SMTP_PORT = "587"

ALLOWED_ORIGIN = "http://localhost:5173"
RUNNING_FROM = "http://localhost:8000"
```

Some of these options might not be obvious. `DATABASE_URL` is the url to your database server (can be on the same machine) for more information see the [database installation](#database) section.

`SECRET_KEY` is the key used internally by passlib to hash user passwords as well as `ALGORITHM`, which determines the algorithm. For more information, see `passlib`'s relevant documentation.

`ALLOWED_ORIGIN` is the address of the server where you will be hosting the front end and making HTTP queries to this api.

Lastly, `RUNNING_FROM` is the address of the server where this api is running from. This is used internally by the email sender to send activation links.

### Database

This is the last step before you can run the app or deploy it using one of the compatible methods.

You will need to use `alembic` to create database tables. Type the following commands to do so:

```
alembic upgrade head
```

This will create the default `app.db` file. This is an SQLite database. If you want to store data in something else, like MySQL for example, you can edit the file `alembic.ini`. For more information, please see SQLAlchemy's relevant documentation.

If you have properly configured `alembic` this should have successfully created the tables.

### Deployment Options

You can follow any of FastAPI's listed deployment methods from their documentation.
