import json
import re
from llama_cpp import Llama
from datetime import datetime

llm = Llama(
    model_path="Backend/models/Qwen2.5-7B-Instruct-1M-Q4_K_M.gguf",
    n_gpu_layers=35,
    n_ctx=2048,
    verbose=True
)

def calculate_time_remaining(due_date: str) -> str:
    """Calculate remaining time or time past due relative to now."""
    if not due_date:
        return "No due date"
    current_time = datetime.now()
    due_time = datetime.fromisoformat(due_date)
    time_diff = due_time - current_time
    
    if time_diff.total_seconds() > 0:
        days = time_diff.days
        hours = time_diff.seconds // 3600
        minutes = (time_diff.seconds % 3600) // 60
        if days > 0:
            return f"{days} days, {hours} hours left"
        elif hours > 0:
            return f"{hours} hours, {minutes} minutes left"
        else:
            return f"{minutes} minutes left"
    else:
        days = abs(time_diff.days)
        hours = abs(time_diff.seconds // 3600)
        minutes = abs((time_diff.seconds % 3600) // 60)
        if days > 0:
            return f"Overdue by {days} days, {hours} hours"
        elif hours > 0:
            return f"Overdue by {hours} hours, {minutes} minutes"
        else:
            return f"Overdue by {minutes} minutes"

def generate_suggestions(tasks: list, mood, energy) -> dict:
    mood_str = mood.name if hasattr(mood, "name") else str(mood or "Happy")
    energy_str = energy.name if hasattr(energy, "name") else str(energy or "Moderate")
    current_datetime = datetime.now().isoformat()

    task_list_str = ", ".join([
        f"{t['title']} (Type: {t['task_type']}, Time to Complete: {t['eta_time']}, "
        f"Due: {t['due_date'] or 'No due date'}, Time Remaining: {calculate_time_remaining(t['due_date'])}, "
        f"Priority: {t['priority']}, Status: {t['status']})"
        for t in tasks
    ]) or "No tasks to do right now"

    prompt = (
        f"Today is {current_datetime}. Here are the user's tasks: [{task_list_str}].\n"
        f"The user is feeling {mood_str} with {energy_str} energy.\n"
        "Pick one task as the main suggestion and another as a backup suggestion.\n"
        "Base your choices on how the user feels, their energy, when tasks are due (including time remaining or overdue), "
        "and task details like how long they take.\n"
        "Give the most attention to the task priority, then compatibility with the mood and energy.\n"
        "No matter what the highest priority task must be the main suggestion.\n"
        "Never give enums unless you convert them to generic human readble ones, Strictly no technical terms.\n"
        "Never calculate any time required or overdue, just state if its overdue or not.\n"
        "Must relate every suggestion you give to users mood and energy (feeling).\n"
        "Write friendly, simple explanations for each suggestion that anyone can understand.\n"
        "Return a single, valid JSON object with no extra text:\n"
        "{\n"
        '    "main_suggestion": "Task title - why it fits their mood, energy, and schedule (No Due time calculations or numbers)",\n'
        '    "alternative_suggestion": "Task title - why it’s a good backup choice (No Due time calculations or numbers)"\n'
        "}\n"
    )
    print(f"Prompt sent to LLM: {prompt}")

    response = llm(prompt, max_tokens=1000, temperature=0.1, stop=["}\n"])
    raw_output = response["choices"][0]["text"].strip()
    print(f"Raw LLM output: '{raw_output}'")
    
    if not raw_output.endswith("}"):
        raw_output += "}"

    json_match = re.search(r'\{.*?\}', raw_output, re.DOTALL)
    json_str = json_match.group(0) if json_match else raw_output

    try:
        suggestions = json.loads(json_str)
        if not all(key in suggestions for key in ["main_suggestion", "alternative_suggestion"]):
            raise ValueError("Missing required JSON keys")
        return suggestions
    except (json.JSONDecodeError, ValueError) as e:
        print(f"Error: {e}, raw output: '{raw_output}'")
        main_task = tasks[0]["title"] if tasks else "Start something small"
        alt_task = tasks[1]["title"] if len(tasks) > 1 else "Take a quick break"
        return {
            "main_suggestion": f"{main_task} - It matches your {mood_str.lower()} mood and {energy_str.lower()} energy!",
            "alternative_suggestion": f"{alt_task} - Another easy option for your {energy_str.lower()} energy."
        }

def generate_motivational_message(mood, energy) -> dict:
    mood_str = mood.name if hasattr(mood, "name") else str(mood or "Happy")
    energy_str = energy.name if hasattr(energy, "name") else str(energy or "Moderate")
    current_datetime = datetime.now().isoformat()

    prompt = (
        f"Today is {current_datetime}. The user is feeling {mood_str} with {energy_str} energy.\n"
        "Give them a friendly, uplifting message to boost their mood and energy.\n"
        "Keep it simple and positive, suggesting something they can do right now.\n"
        "Give special attention and mood and energy level of the user.\n"
        "Return a single, valid JSON object with no extra text:\n"
        "{\n"
        '    "motivational_message": "A short, cheerful suggestion to lift their spirits and energy"\n'
        "}\n"
    )
    print(f"Prompt sent to LLM: {prompt}")

    response = llm(prompt, max_tokens=100, temperature=0.3, stop=["}\n"])
    raw_output = response["choices"][0]["text"].strip()
    print(f"Raw LLM output: '{raw_output}'")
    
    if not raw_output.endswith("}"):
        raw_output += "}"

    json_match = re.search(r'\{.*?\}', raw_output, re.DOTALL)
    json_str = json_match.group(0) if json_match else raw_output

    try:
        result = json.loads(json_str)
        if "motivational_message" not in result:
            raise ValueError("Missing motivational_message key")
        return result
    except (json.JSONDecodeError, ValueError) as e:
        print(f"Error: {e}, raw output: '{raw_output}'")
        return {
            "motivational_message": f"Feeling {mood_str.lower()}? Take a moment to stretch and enjoy some fresh air—it’ll perk you right up!"
        }