from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    title: str
    task_type: str
    eta_time: str
    priority: str
    status: str
    due_date: Optional[datetime] = None
    position: Optional[int] = None
    should_notify: bool = False 
    notify_when: Optional[str] = None  

    @validator("due_date", pre=True)
    def parse_due_date(cls, value):
        if isinstance(value, str):
            # Handle extra precision like ":00:00"
            try:
                return datetime.fromisoformat(value.rstrip(":00"))
            except ValueError:
                raise ValueError("Invalid datetime format")
        return value

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    owner_id: int
    created_at: datetime
    position: int
    class Config:
        from_attributes = True
        
class TaskPositionUpdate(BaseModel):
    position: int

class UserDataBase(BaseModel):
    current_mood: Optional[str] = None  
    current_energy: Optional[str] = None 

class UserDataCreate(UserDataBase):
    pass

class UserData(UserDataBase):
    id: int
    owner_id: int
    class Config:
        from_attributes = True

class SuggestionBase(BaseModel):
    current_suggestion: str
    current_alternative_suggestion: str
    current_moti_message: str

class SuggestionCreate(SuggestionBase):
    pass

class Suggestion(SuggestionBase):
    id: int
    owner_id: int
    class Config:
        from_attributes = True
        
class UserLogin(BaseModel):
    email: str
    password: str