from jose import jwt
import os
from datetime import datetime, timedelta

def create_jwt_token(email):
    payload = {
        "sub": email,
        "exp": datetime.utcnow() + timedelta(hours=2)
    }
    return jwt.encode(payload, os.getenv("SESSION_SECRET_KEY"), algorithm="HS256")
