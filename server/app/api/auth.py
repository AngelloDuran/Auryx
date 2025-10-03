from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserLogin, Token
from app.services.auth import create_user, get_user_by_email
from app.core.security import verify_password, create_access_token
from server.db.database import SessionLocal

router = APIRouter(prefix="/auth", tags=["auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    new_user = create_user(db, user)
    token = create_access_token(data={"sub": new_user.email})
    return {"access_token": token}

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, user.email)
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Credenciales inválidas")
    token = create_access_token(data={"sub": db_user.email})
    return {"access_token": token}
