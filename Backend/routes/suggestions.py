from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, llm
from ..database import get_db
from datetime import datetime

router = APIRouter(prefix="/suggestions", tags=["Suggestions"])

@router.post("/{user_id}", response_model=schemas.Suggestion)
def generate_suggestion(user_id: int, db: Session = Depends(get_db)):
    # Fetch only incomplete tasks (not "Completed")
    tasks = db.query(models.Task).filter(
        models.Task.owner_id == user_id,
        models.Task.status != "Completed"  # Exclude completed tasks
    ).all()
    user_data = db.query(models.UserData).filter(models.UserData.owner_id == user_id).first()
    if not user_data:
        raise HTTPException(status_code=400, detail="User data not found")
    
    # Include all task fields
    task_list = [
        {
            "title": t.title,
            "task_type": t.task_type,
            "eta_time": t.eta_time,
            "due_date": t.due_date.isoformat() if t.due_date else None,
            "priority": t.priority,
            "status": t.status
        } for t in tasks
    ]
    suggestions = llm.generate_suggestions(task_list, user_data.current_mood, user_data.current_energy)
    
    db_suggestion = db.query(models.Suggestion).filter(models.Suggestion.owner_id == user_id).first()
    if db_suggestion:
        db.delete(db_suggestion)
        db.commit()
    
    new_suggestion = models.Suggestion(
        owner_id=user_id,
        current_suggestion=suggestions["main_suggestion"],
        current_alternative_suggestion=suggestions["alternative_suggestion"],
        current_moti_message=suggestions["motivational_message"]
    )
    db.add(new_suggestion)
    db.commit()
    db.refresh(new_suggestion)
    return new_suggestion

@router.get("/{user_id}", response_model=schemas.Suggestion)
def get_suggestion(user_id: int, db: Session = Depends(get_db)):
    suggestion = db.query(models.Suggestion).filter(models.Suggestion.owner_id == user_id).first()
    if not suggestion:
        raise HTTPException(status_code=404, detail="No suggestion found")
    return suggestion

@router.get("/motivation/{user_id}")
def get_motivational_message(user_id: int, db: Session = Depends(get_db)):
    user_data = db.query(models.UserData).filter(models.UserData.owner_id == user_id).first()
    suggestion = db.query(models.Suggestion).filter(models.Suggestion.owner_id == user_id).first()
    
    if not user_data:
        raise HTTPException(status_code=400, detail="User data not found")
    
    if suggestion:
        moti_message = llm.generate_motivational_message(user_data.current_mood, {
            "current_suggestion": suggestion.current_suggestion,
            "current_alternative_suggestion": suggestion.current_alternative_suggestion
        })
        suggestion.current_moti_message = moti_message
        db.commit()
        db.refresh(suggestion)
        return {"motivational_message": moti_message}
    else:
        moti_message = llm.generate_motivational_message(user_data.current_mood)
        return {"motivational_message": moti_message}