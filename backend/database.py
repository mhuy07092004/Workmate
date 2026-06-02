from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./workmate.db"

# Connecting the python code to the database using the connection
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for all database models
Base = declarative_base()

# loads all model classes - checks the database - creates tables that do not already exist


def init_db():
    from models import user, job, news, post, application, profile, saved_item, comment
    Base.metadata.create_all(bind=engine)
