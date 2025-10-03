from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# URL de conexión a MySQL
DATABASE_URL = "mysql+mysqlconnector://root:admin@localhost:3306/auryx"

# Crear el motor de conexión
engine = create_engine(DATABASE_URL, echo=True)

# Crear la sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos
Base = declarative_base()

# Dependencia para usar en endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
