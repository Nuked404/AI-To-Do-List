from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/user_data", tags=["User Data"])

@router.post("/{user_id}", response_model=schemas.UserData)
def update_user_data(user_id: int, user_data: schemas.UserDataCreate, db: Session = Depends(get_db)):
    db_data = db.query(models.UserData).filter(models.UserData.owner_id == user_id).first()
    if db_data:
        db.delete(db_data)
        db.commit()
    new_data = models.UserData(owner_id=user_id, **user_data.dict())
    db.add(new_data)
    db.commit()
    db.refresh(new_data)
    return new_data