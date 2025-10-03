from jose import jwt
import os
from datetime import datetime, timedelta

# Simulación de base de datos
fake_db = {}

def create_jwt_token(email):
    payload = {
        "sub": email,
        "exp": datetime.utcnow() + timedelta(hours=2)
    }
    return jwt.encode(payload, os.getenv("SECRET_KEY"), algorithm="HS256")

async def get_or_create_user(user_info):
    email = user_info['email']
    name = user_info.get('name', 'No Name')

    # Simula búsqueda en la base
    if email not in fake_db:
        fake_db[email] = {"email": email, "name": name}
    
    return fake_db[email]
