from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import os

security = HTTPBearer()

def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(token.credentials, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        return payload["sub"]
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
        )
from fastapi import APIRouter, Depends
from auth.dependencies import get_current_user

router = APIRouter()

@router.get("/perfil")
def perfil(user_email: str = Depends(get_current_user)):
    return {"msg": f"Bienvenido {user_email}"}
