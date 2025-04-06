import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from .config import EMAIL_CONFIG
import logging

logger = logging.getLogger(__name__)

def send_otp_email(to_email: str, otp_code: str, purpose: str):
    subject = f"Your OTP for {purpose} - AI Task Manager"
    
    # HTML email template with Tailwind-inspired styles (inlined for email compatibility)
    html_body = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 40px auto; background: linear-gradient(to right, #dbeafe, #e9d5ff); border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <div style="background: linear-gradient(to right, #3b82f6, #a855f7); padding: 20px; text-align: center;">
                <h1 style="color: #ffffff; font-size: 24px; margin: 0;">AI Task Manager</h1>
            </div>
            <div style="padding: 24px; background-color: #ffffff; text-align: center;">
                <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 16px;">Your One-Time Password (OTP)</h2>
                <p style="color: #4b5563; font-size: 16px; margin-bottom: 24px;">
                    Hello! You’ve requested an OTP for {purpose.lower()}. Use the code below to proceed:
                </p>
                <div style="background-color: #f3f4f6; display: inline-block; padding: 12px 24px; border-radius: 6px; font-size: 24px; font-weight: bold; color: #3b82f6; letter-spacing: 2px;">
                    {otp_code}
                </div>
                <p style="color: #4b5563; font-size: 14px; margin-top: 24px;">
                    This OTP is valid for <strong>10 minutes</strong>. If you didn’t request this, please ignore this email.
                </p>
            </div>
            <div style="background-color: #f3f4f6; padding: 16px; text-align: center;">
                <p style="color: #6b7280; font-size: 12px; margin: 0;">
                    &copy; 2025 AI Task Manager. All rights reserved.
                </p>
            </div>
        </div>
    </body>
    </html>
    """

    # Create a multipart message (HTML + fallback plain text)
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = EMAIL_CONFIG["SMTP_USERNAME"]
    msg["To"] = to_email

    # Plain text fallback
    text_body = f"Your One-Time Password (OTP) for {purpose} is: {otp_code}\n\nThis OTP is valid for 10 minutes."
    msg.attach(MIMEText(text_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    if EMAIL_CONFIG["MASTER_EMAIL_ENABLED"]:
        try:
            with smtplib.SMTP(EMAIL_CONFIG["SMTP_SERVER"], EMAIL_CONFIG["SMTP_PORT"]) as server:
                server.starttls()
                server.login(EMAIL_CONFIG["SMTP_USERNAME"], EMAIL_CONFIG["SMTP_PASSWORD"])
                server.send_message(msg)
            logger.info(f"OTP email sent to {to_email}")
        except Exception as e:
            logger.error(f"Failed to send OTP email: {e}")
            raise
    else:
        # If disabled, log and return the content
        alert_msg = f"Email sending is disabled. OTP for {to_email}: {otp_code}"
        logger.info(alert_msg)
        print(alert_msg)  # For console log
        return alert_msg  # For frontend alert
