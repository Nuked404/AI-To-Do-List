from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/user_data", tags=["User Data"])

@router.post("/{user_id}", response_model=schemas.UserData)
def update_user_data(user_id: int, user_data: schemas.UserDataCreate, db: Session = Depends(get_db)):
    db_data = db.query(models.UserData).filter(models.UserData.owner_id == user_id).first()
    if db_data:
        # Update only provided fields, retain existing if not provided
        if user_data.current_mood is not None:
            db_data.current_mood = user_data.current_mood
        if user_data.current_energy is not None:
            db_data.current_energy = user_data.current_energy
    else:
        # Create new record with defaults if missing
        new_data = models.UserData(
            owner_id=user_id,
            current_mood=user_data.current_mood or "Happy",
            current_energy=user_data.current_energy or "Moderate"
        )
        db.add(new_data)
    db.commit()
    db.refresh(db_data or new_data)
    return db_data or new_data

@router.get("/{user_id}", response_model=schemas.UserData)
def get_user_data(user_id: int, db: Session = Depends(get_db)):
    db_data = db.query(models.UserData).filter(models.UserData.owner_id == user_id).first()
    if not db_data:
        raise HTTPException(status_code=404, detail="User data not found")
    return db_data