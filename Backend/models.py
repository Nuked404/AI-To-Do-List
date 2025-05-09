from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, Text, Boolean
from sqlalchemy.sql import func
from .database import Base
import enum

class MoodEnum(enum.Enum):
    HAPPY = "Happy"
    CALM = "Calm"
    FOCUSED = "Focused"
    ANXIOUS = "Anxious"
    SAD = "Sad"
    BORED = "Bored"

class EnergyEnum(enum.Enum):
    HIGH = "High"
    MODERATE = "Moderate"
    LOW = "Low"

class TaskTypeEnum(enum.Enum):
    MENTAL = "Mental"
    PHYSICAL = "Physical"
    CREATIVE = "Creative" 
    
class NotifyWhenEnum(enum.Enum): 
    ON_DUE = "On Due Time"
    FIVE_MIN_BEFORE = "5 Minutes Before"
    THIRTY_MIN_BEFORE = "30 Minutes Before"
    ONE_HOUR_BEFORE = "1 Hour Before"

class PriorityEnum(enum.Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    NORMAL = "Normal"
    LOW = "Low"

class StatusEnum(enum.Enum):
    PENDING = "Pending"
    ONGOING = "Ongoing"
    COMPLETED = "Completed"

class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    passhash = Column(String(255), nullable=False)

class Task(Base):
    __tablename__ = "task"
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    title = Column(String(100), nullable=False)
    task_type = Column(Enum(TaskTypeEnum, name="tasktypeenum", create_constraint=True, values_callable=lambda x: [e.value for e in x]), nullable=False)
    eta_time = Column(String(10), nullable=False)
    priority = Column(Enum(PriorityEnum, name="priorityenum", create_constraint=True, values_callable=lambda x: [e.value for e in x]), nullable=False)
    status = Column(Enum(StatusEnum, name="statusenum", create_constraint=True, values_callable=lambda x: [e.value for e in x]), nullable=False)
    due_date = Column(DateTime, nullable=True) 
    created_at = Column(DateTime, default=func.now())
    position = Column(Integer, nullable=False, default=0)
    should_notify = Column(Boolean, default=False, nullable=False) 
    notify_when = Column(Enum(NotifyWhenEnum, name="notifywhenenum", create_constraint=True, values_callable=lambda x: [e.value for e in x]), nullable=True)

class UserData(Base):
    __tablename__ = "user_data"
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    current_mood = Column(Enum(MoodEnum, name="moodenum", create_constraint=True, values_callable=lambda x: [e.value for e in x]), nullable=False)
    current_energy = Column(Enum(EnergyEnum, name="energyenum", create_constraint=True, values_callable=lambda x: [e.value for e in x]), nullable=False)

class Suggestion(Base):
    __tablename__ = "suggestion"
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    current_suggestion = Column(Text, nullable=False)  # Changed to Text
    current_alternative_suggestion = Column(Text, nullable=False)  # Changed to Text
    current_moti_message = Column(Text, nullable=False)  # Changed to Text
    
class OTPPurposeEnum(enum.Enum):
    REGISTRATION = "Registration"
    PASSWORD_RESET = "PasswordReset"

class OTP(Base):
    __tablename__ = "otp"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    otp_code = Column(String(6), nullable=False)
    purpose = Column(
        Enum(OTPPurposeEnum, name="otppurposeenum", create_constraint=True, values_callable=lambda x: [e.value for e in x]),
        nullable=False
    )
    created_at = Column(DateTime, default=func.now())
    expires_at = Column(DateTime, nullable=False)