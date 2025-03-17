from llama_cpp import Llama

# Load GGUF model locally (adjust path and parameters as needed)
llm = Llama(model_path="C:/Users/NukedBunny/Desktop/AI To Do List/Backend/models/dr_samantha-7b.Q5_K_S.gguf", n_gpu_layers=35, n_ctx=2048)  # GPU offloading

def generate_suggestions(tasks: list, mood: str, energy: str) -> dict:
    prompt = f"""
    Given the following tasks: {tasks},
    and the user's current mood: {mood}, and energy level: {energy},
    provide two task suggestions (one main, one alternative) and a motivational message.
    Format the response as JSON:
    {
        "main_suggestion": "string",
        "alternative_suggestion": "string",
        "motivational_message": "string"
    }
    """
    response = llm(prompt, max_tokens=200, temperature=0.7)
    return eval(response["choices"][0]["text"])  # Assuming JSON-like string output

def generate_motivational_message(mood: str, suggestions: dict = None) -> str:
    if suggestions:
        prompt = f"""
        Given the user's current mood: {mood}, and their current suggestions:
        Main: {suggestions['current_suggestion']}, Alternative: {suggestions['current_alternative_suggestion']},
        provide a motivational message to encourage task completion.
        """
    else:
        prompt = f"""
        Given the user's current mood: {mood}, provide a motivational message to improve their mood.
        """
    response = llm(prompt, max_tokens=100, temperature=0.7)
    return response["choices"][0]["text"].strip()