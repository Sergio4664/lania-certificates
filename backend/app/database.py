# app/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# URL de conexión a PostgreSQL
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://lania_user:12345678@localhost:5432/lania_certificates"
)

# Motor de conexión
engine = create_engine(DATABASE_URL, echo=True)

# Sesión local para interactuar con la BD
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base de los modelos
Base = declarative_base()
