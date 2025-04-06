from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import random
from datetime import datetime, timedelta
from .. import models, schemas, auth, email
from ..database import get_db

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/otp/request")
def request_otp(otp_request: schemas.OTPRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == otp_request.email).first()
    if otp_request.purpose == "Registration" and user:
        raise HTTPException(status_code=400, detail="Email already registered")
    if otp_request.purpose == "PasswordReset" and not user:
        raise HTTPException(status_code=404, detail="User not found")

    otp_code = f"{random.randint(100000, 999999)}"
    expires_at = datetime.now() + timedelta(minutes=10)

    if user:
        otp = models.OTP(
            user_id=user.id,
            otp_code=otp_code,
            purpose=otp_request.purpose,
            expires_at=expires_at
        )
    else:  # For registration, create a temporary user
        temp_user = models.User(name="Temp", email=otp_request.email, passhash="temp")
        db.add(temp_user)
        db.commit()
        db.refresh(temp_user)
        otp = models.OTP(
            user_id=temp_user.id,
            otp_code=otp_code,
            purpose=otp_request.purpose,
            expires_at=expires_at
        )
    
    db.add(otp)
    db.commit()

    result = email.send_otp_email(otp_request.email, otp_code, otp_request.purpose)
    if not email.EMAIL_CONFIG["MASTER_EMAIL_ENABLED"]:
        return {"message": "OTP generated", "debug_content": result}
    return {"message": "OTP sent to your email"}

@router.post("/otp/verify")
def verify_otp(otp_verify: schemas.OTPVerify, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == otp_verify.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    otp = db.query(models.OTP).filter(
        models.OTP.user_id == user.id,
        models.OTP.purpose == otp_verify.purpose,
        models.OTP.otp_code == otp_verify.otp_code
    ).first()
    
    if not otp or otp.expires_at < datetime.now():
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
    db.delete(otp)  # OTP is one-time use
    db.commit()
    return {"message": "OTP verified", "user_id": user.id}

@router.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Registration now requires OTP verification first
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user and db_user.passhash != "temp":  # Ignore temp users
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.hash_password(user.password)
    if db_user:  # Update temp user
        db_user.name = user.name
        db_user.passhash = hashed_password
    else:
        db_user = models.User(name=user.name, email=user.email, passhash=hashed_password)
        db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/reset-password")
def reset_password(email: str, new_password: str, db: Session = Depends(get_db)):
    # Password reset requires OTP verification first
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.passhash = auth.hash_password(new_password)
    db.commit()
    return {"message": "Password reset successful"}

@router.post("/login")
def login_user(login_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_data.email).first()
    if not user or not auth.verify_password(login_data.password, user.passhash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"user_id": user.id, "message": "Login successful"}

@router.get("/{user_id}", response_model=schemas.User)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user