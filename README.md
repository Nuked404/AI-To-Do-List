# AI Task Manager

A web-based task management application powered by AI to provide personalized task suggestions and motivational messages based on user mood and energy levels.

## Description

AI Task Manager is a full-stack application designed to help users organize tasks efficiently. It features a responsive UI built with HTML, Tailwind CSS, and JavaScript, a Flask-based backend for API services, and a MySQL database for data persistence. Key features include task prioritization, mood/energy-based AI suggestions, and a motivational message generator.

## Installation

Follow these steps to set up the project locally.

### Prerequisites

- Python 3.8 or higher
- MySQL 8.0 or higher
- Node.js (optional, for development tools like live server)
- Git

### Backend Setup

1. **Clone the Repository**
   ```
   git clone https://github.com/yourusername/ai-task-manager.git
   cd ai-task-manager
   ```

2. **Set Up Virtual Environment**
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python Requirements**
   Install the required packages listed in `requirements.txt`:
   ```
   pip install -r Backend/requirements.txt
   ```
   Example `requirements.txt` contents:
   ```
   Flask==2.3.2
   Flask-Cors==3.0.10
   mysql-connector-python==8.0.33
   ```

4. **SQL Database Setup**
   - Install MySQL if not already installed:
     ```
     # On Ubuntu: sudo apt-get install mysql-server
     # On macOS: brew install mysql
     # On Windows: Download from https://dev.mysql.com/downloads/
     ```
   - Start the MySQL server:
     ```
     sudo service mysql start  # On Ubuntu
     mysql.server start        # On macOS
     ```
   - Create a database and user:
     ```
     mysql -u root -p
     CREATE DATABASE ai_task_manager;
     CREATE USER 'task_user'@'localhost' IDENTIFIED BY 'your_password';
     GRANT ALL PRIVILEGES ON ai_task_manager.* TO 'task_user'@'localhost';
     FLUSH PRIVILEGES;
     EXIT;
     ```
   - Import the schema:
     ```
     mysql -u task_user -p ai_task_manager < Backend/schema.sql
     ```
     Ensure `schema.sql` contains your table definitions (e.g., `users`, `tasks`, `user_data`).
