import json
import re
from llama_cpp import Llama
from datetime import datetime

# Load GGUF model with GPU offloading
llm = Llama(
    model_path="Backend/models/Qwen2.5-7B-Instruct-1M-Q4_K_M.gguf",
    n_gpu_layers=35,
    n_ctx=2048,
    verbose=True
)

def generate_suggestions(tasks: list, mood, energy) -> dict:
    mood_str = mood.name if hasattr(mood, "name") else str(mood or "Happy")
    energy_str = energy.name if hasattr(energy, "name") else str(energy or "Moderate")
    current_date = datetime.now().isoformat()

    task_list_str = ", ".join([
        f"{t['title']} (Type: {t['task_type']}, ETA: {t['eta_time']}, Due: {t['due_date'] or 'None'}, Priority: {t['priority']}, Status: {t['status']})"
        for t in tasks
    ]) or "No incomplete tasks available"

    prompt = (
        f"Given the current date: {current_date}, and the user's incomplete tasks: [{task_list_str}],\n"
        f"and current mood: {mood_str}, and energy level: {energy_str},\n"
        "select one task from the list as the main suggestion and another as an alternative suggestion,\n"
        "based on the mood, energy, and task details (type, ETA, due date, priority).\n"
        "Provide justifications for each suggestion and a motivational message to improve the mood.\n"
        "Return a single, valid JSON object with no additional text or comments:\n"
        "{\n"
        '    "main_suggestion": "Task title, how it relates to attributes like mood, energy, due date, eta for task completion, task type,priority",\n'
        '    "alternative_suggestion": "similar to main_suggestion template",\n'
        '    "motivational_message": "Give suggestion to improve users mood by doing something like eating something or etc. to improve the mood, justify that as well"\n'
        "}\n"
    )
    print(f"Prompt sent to LLM: {prompt}")

    response = llm(prompt, max_tokens=1000, temperature=0.1, stop=["}\n"]) 
    raw_output = response["choices"][0]["text"].strip()
    print(f"Raw LLM output: '{raw_output}'")
    
    # Ensure the output ends with "}" if truncated early
    if not raw_output.endswith("}"):
        raw_output += "}"

    # Extract the first valid JSON block
    json_match = re.search(r'\{.*?\}', raw_output, re.DOTALL)
    if json_match:
        json_str = json_match.group(0)
        print(f"Extracted JSON: '{json_str}'")
    else:
        json_str = raw_output

    try:
        suggestions = json.loads(json_str)
        if not all(key in suggestions for key in ["main_suggestion", "alternative_suggestion", "motivational_message"]):
            raise ValueError("Missing required JSON keys")
        return suggestions
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}, raw output: '{raw_output}'")
        main_task = tasks[0]["title"] if tasks else "Start a small task"
        alt_task = tasks[1]["title"] if len(tasks) > 1 else "Take a short break"
        return {
            "main_suggestion": f"{main_task} - Your {mood_str.lower()} mood and {energy_str.lower()} energy suit this task.",
            "alternative_suggestion": f"{alt_task} - A good fit for your current {energy_str.lower()} energy.",
            "motivational_message": f"Feeling {mood_str.lower()}? Try a quick snack to boost your mood—it works wonders!"
        }
    except ValueError as e:
        print(f"Validation error: {e}, raw output: '{raw_output}'")
        return {
            "main_suggestion": "Review your tasks - Your mood and energy can handle it.",
            "alternative_suggestion": "Take a break - Recharge for your next step.",
            "motivational_message": f"Feeling {mood_str.lower()}? A short walk can lift your spirits!"
        }

def generate_motivational_message(mood, suggestions: dict = None) -> str:
    mood_str = mood.name if hasattr(mood, "name") else str(mood or "Happy")
    if suggestions:
        prompt = (
            f"Given the user's mood: {mood_str}, and their suggestions:\n"
            f"Main: {suggestions['current_suggestion']}, Alternative: {suggestions['current_alternative_suggestion']},\n"
            "provide a motivational message to improve their mood and encourage task completion.\n"
            "Return plain text, no JSON."
        )
    else:
        prompt = (
            f"Given the user's mood: {mood_str},\n"
            "provide a motivational message to improve their mood.\n"
            "Return plain text, no JSON."
        )
    response = llm(prompt, max_tokens=100, temperature=0.3)
    raw_output = response["choices"][0]["text"].strip()
    print(f"Raw motivational output: '{raw_output}'")
    return raw_output