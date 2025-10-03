from sqlalchemy.orm import Session
from server.db import models

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, email: str, name: str = None, picture: str = None):
    db_user = models.User(email=email, name=name, picture=picture)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
