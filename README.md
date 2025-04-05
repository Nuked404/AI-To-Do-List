# AI Task Manager

A full-stack web application designed to help users manage tasks efficiently with AI-powered suggestions and motivational boosts tailored to their mood and energy levels. This project combines a modern frontend with a robust backend to deliver a seamless user experience.

## Features

- **Task Management**: Create, edit, delete, and prioritize tasks with due dates and notifications.
- **AI Suggestions**: Get personalized task recommendations based on mood, energy, and task priority using a local language model.
- **Motivational Boosts**: Receive uplifting messages to stay motivated, customized to your current state.
- **Responsive Design**: Works across devices with a dynamic, user-friendly interface.
- **Notifications**: Browser-based notifications for task reminders using Service Workers.

## Technologies Used

### Backend

- **FastAPI**: A modern, fast (high-performance) web framework for building APIs with Python.
- **SQLAlchemy**: ORM for database interactions with MySQL.
- **Llama.cpp**: For running the local language model (Qwen2.5-7B-Instruct-1M-Q4_K_M.gguf).
- **Passlib**: For secure password hashing with bcrypt.
- **MySQL**: Relational database for storing user data, tasks, and suggestions.

### Frontend

- **JavaScript (ES6+)**: Modular architecture with dynamic DOM manipulation.
- **HTML5 & CSS3**: Structured content with custom styles (initially scaffolded with Tailwind CSS, now fully custom-generated dynamically).
- **Service Workers**: For offline capabilities and push notifications.
- **FontAwesome**: Icons for enhanced UI.

### Other Tools

- **Python 3.9+**: Backend runtime.
- **MySQL Connector**: For database connectivity.

## Prerequisites

- **Python 3.9+**: For running the backend.
- **MySQL**: For the database (version 8.0+ recommended).
- **Node.js & npm**: Optional, for frontend development with a live server.
- **XAMPP / Live Server**: Optional, for hosting the frontend locally.
- **Git**: For cloning the repository.

## Setup Instructions

### 1. Clone the Repository

```bash###bash
git clone https://github.com/Nuked404/ai-task-manager.git
cd ai-task-manager
```

### 2. Backend Setup

1. **Install Dependencies**:
   ```bash
   pip install -r Backend/requirements.txt
   ```
2. **Configure Database**:
   - Update the `SQLALCHEMY_DATABASE_URL` in `Backend/database.py` with your MySQL credentials:
     ```python
     SQLALCHEMY_DATABASE_URL = "mysql+mysqlconnector://<username>:<password>@localhost/ai_task_manager_db"
     ```
     Default: `root:12345@localhost/ai_task_manager_db`.
3. **Import Database Schema**:
   - Import the SQL file into your MySQL database:
     ```bash
     mysql -u <username> -p ai_task_manager_db < ai_task_manager_db.sql
     ```
4. **Language Model**:
   - **Note**: The AI model (`Qwen2.5-7B-Instruct-1M-Q4_K_M.gguf`) is not included in this repository due to its size. It will be added in the future or can be downloaded separately from [Hugging Face](https://huggingface.co/models) or a similar source. Place it in `Backend/models/`.
5. **Run the Backend**:
   ```bash
   uvicorn Backend.main:app --reload --host 0.0.0.0 --port 8000
   ```

### 3. Frontend Setup

1. **Serve the Frontend**:
   - **Option 1: XAMPP**: Place the `Web UI` folder in `htdocs` and access via `http://localhost/Web UI/`.
   - **Option 2: Live Server**: Use VS Code’s Live Server extension or a similar tool:
     ```bash
     npx live-server Web\ UI
     ```
   - **Option 3: npm**: Install a simple server:
     ```bash
     npm install -g serve
     serve Web\ UI
     ```
2. **Update API Base URL** (if needed):
   - Edit `Web UI/Scripts/Config.js` if your backend is not running on `https://192.168.1.139:8000`:
     ```javascript
     export const API_BASE_URL = "http://localhost:8000";
     ```

### 4. Access the Application

- Open your browser and navigate to `http://localhost:<frontend-port>` (e.g., `http://localhost:3000` for `serve`).

## Configuration Files to Adjust

- **Backend**:
  - `Backend/database.py`: Update database connection string.
- **Frontend**:
  - `Web UI/Scripts/Config.js`: Update `API_BASE_URL` if backend host/port changes.

## Usage

1. **Register**: Go to `/register.html` to create an account.
2. **Login**: Use `/login.html` to access the dashboard.
3. **Manage Tasks**: Add, edit, or delete tasks from the main interface.
4. **AI Features**: Set your mood and energy, then click "Get Suggestions" or "Get Motivation".

## Notes

- The frontend CSS was initially built with Tailwind CSS but is now dynamically generated for flexibility—no Tailwind dependency remains.
- Ensure your system has sufficient resources (e.g., 16GB RAM Or 8GB VRAM for GPU inference) to run the language model locally.

## Future Improvements

- Add authentication tokens for secure API access.
- Include the language model in the repository or provide a download script.
- Enhance notification system with sound or custom timings.

## License

This project is licensed under the [MIT License](LICENSE). See the LICENSE file for details.

## Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework.
- [Llama.cpp](https://github.com/ggerganov/llama.cpp) for local LLM inference.
- [FontAwesome](https://fontawesome.com/) for icons.
