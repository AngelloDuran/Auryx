from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from starlette.middleware.sessions import SessionMiddleware
import os
from dotenv import load_dotenv

# Importaciones del proyecto
from server.auth.google import oauth
from server.db import database, models, crud
from server.auth.utils import create_jwt_token

load_dotenv()

app = FastAPI()

# Inicializar la base de datos
models.Base.metadata.create_all(bind=database.engine)

# Dependency para obtener la sesión de DB
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Middleware de sesiones
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SESSION_SECRET_KEY"))

@app.get("/")
def index():
    return {"msg": "Bienvenido a Auryx Auth"}

# LOGIN con Google
@app.get("/auth/google/login")
async def login_with_google(request: Request):
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
    return await oauth.google.authorize_redirect(request, redirect_uri)

# CALLBACK de Google
@app.get("/auth/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = await oauth.google.parse_id_token(request, token)

        # Guardar usuario en DB si no existe
        user = crud.get_user_by_email(db, user_info["email"])
        if not user:
            user = crud.create_user(db, user_info)

        # Generar JWT
        jwt_token = create_jwt_token({"sub": user.email})

        # Guardar en sesión
        request.session["user"] = {
            "email": user.email,
            "name": user.name,
            "picture": user.picture,
            "token": jwt_token
        }

        # Redirigir al frontend con token en query (opcional)
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        return RedirectResponse(url=f"{frontend_url}?token={jwt_token}")

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Endpoint para validar sesión
@app.get("/me")
async def get_me(request: Request):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no autenticado")
    return {"user": user}

# Logout
@app.post("/logout")
async def logout(request: Request):
    request.session.clear()
    return {"msg": "Sesión cerrada exitosamente"}
