from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/tasks", tags=["Tasks"])

def normalize_positions(db: Session, owner_id: int, priority: str):
    tasks = db.query(models.Task).filter(
        models.Task.owner_id == owner_id,
        models.Task.priority == priority
    ).order_by(models.Task.position).all()
    for i, task in enumerate(tasks):
        if task.position != i:
            task.position = i
    db.commit()

@router.get("/{user_id}", response_model=list[schemas.Task])
def get_tasks(user_id: int, db: Session = Depends(get_db)):
    tasks = db.query(models.Task).filter(models.Task.owner_id == user_id).order_by(models.Task.priority, models.Task.position).all()
    return tasks

@router.post("/{user_id}", response_model=schemas.Task)
def create_task(user_id: int, task: schemas.TaskCreate, db: Session = Depends(get_db)):
    max_position = db.query(models.Task).filter(
        models.Task.owner_id == user_id,
        models.Task.priority == task.priority
    ).order_by(models.Task.position.desc()).first()
    position = max_position.position + 1 if max_position else 0

    new_task = models.Task(owner_id=user_id, position=position, **task.model_dump())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.put("/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    old_priority = db_task.priority
    old_position = db_task.position  # Store original position
    
    # Update fields from request, excluding position unless priority changes
    task_dict = task.model_dump(exclude_unset=True)  # Only update provided fields
    if old_priority != task.priority:
        max_position = db.query(models.Task).filter(
            models.Task.owner_id == db_task.owner_id,
            models.Task.priority == task.priority
        ).order_by(models.Task.position.desc()).first()
        db_task.position = max_position.position + 1 if max_position else 0
    else:
        task_dict.pop("position", None)  # Don’t override position unless explicitly sent
    
    for key, value in task_dict.items():
        setattr(db_task, key, value)
    
    db.commit()
    if old_priority != task.priority:
        normalize_positions(db, db_task.owner_id, old_priority)
        normalize_positions(db, db_task.owner_id, task.priority)
    else:
        # Only normalize if position wasn’t explicitly changed
        if "position" not in task_dict:
            db_task.position = old_position  # Restore original position
            db.commit()
    
    db.refresh(db_task)
    return db_task

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    normalize_positions(db, db_task.owner_id, db_task.priority)  # Normalize after deletion
    return {"message": "Task deleted"}

@router.put("/position/{task_id}", response_model=schemas.Task)
def update_task_position(task_id: int, position_update: schemas.TaskPositionUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    section_tasks = db.query(models.Task).filter(
        models.Task.owner_id == db_task.owner_id,
        models.Task.priority == db_task.priority
    ).order_by(models.Task.position).all()

    current_position = db_task.position
    new_position = max(0, min(position_update.position, len(section_tasks) - 1))
    if new_position == current_position:
        return db_task

    # Determine if it's a 1-step move (swap) or absolute move (shift)
    position_diff = abs(new_position - current_position)
    if position_diff == 1:
        # Swap with the adjacent task
        target_task = next((t for t in section_tasks if t.position == new_position), None)
        if target_task:
            target_task.position, db_task.position = db_task.position, target_task.position
    else:
        # Shift tasks to accommodate the new position
        if new_position < current_position:
            for t in section_tasks:
                if new_position <= t.position < current_position and t.id != task_id:
                    t.position += 1
        elif new_position > current_position:
            for t in section_tasks:
                if current_position < t.position <= new_position and t.id != task_id:
                    t.position -= 1
        db_task.position = new_position

    db.commit()
    normalize_positions(db, db_task.owner_id, db_task.priority)  # Ensure sequential positions
    db.refresh(db_task)
    return db_task