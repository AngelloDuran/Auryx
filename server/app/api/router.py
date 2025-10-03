from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def home():
    return {"message": "Bienvenido a Auryx API"}
