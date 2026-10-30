import os
import subprocess
import sys
import time

# Keep setup.py runnable from any working directory without replacing user files.
PROJECT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "synthetic-user-platform")
FILES = {
    ".env": "OPENAI_API_KEY=\nPORT=8000\n",
    "requirements.txt": "fastapi>=0.115.0\nuvicorn>=0.30.0\nstreamlit>=1.39.0\npydantic>=2.9.0\nopenai>=1.50.0\npython-dotenv>=1.0.1\nrequests>=2.32.0\n",
    "backend/__init__.py": "",
    "backend/main.py": """from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/")\ndef read_root():\n    return {"message": "Backend is running!"}\n""",
    # Note: To keep this script manageable, the backend/main.py, models.py, agents.py, 
    # memory.py, and frontend/app.py have been abbreviated. 
    # Paste the full code blocks from the previous step into these generated files.
    "backend/models.py": "# Paste models.py code here",
    "backend/memory.py": "# Paste memory.py code here",
    "backend/agents.py": "# Paste agents.py code here",
    "frontend/app.py": "import streamlit as st\n\nst.title('AI-Powered Synthetic User Research Platform')\nst.write('Frontend is running!')\n"
}

def create_files():
    print(f"📁 Creating project folder: {PROJECT_DIR}")
    os.makedirs(PROJECT_DIR, exist_ok=True)
    os.makedirs(os.path.join(PROJECT_DIR, "backend"), exist_ok=True)
    os.makedirs(os.path.join(PROJECT_DIR, "frontend"), exist_ok=True)

    for filepath, content in FILES.items():
        full_path = os.path.join(PROJECT_DIR, filepath)
        if os.path.exists(full_path):
            print(f"   ↪ Keeping existing {filepath}")
            continue
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"   ✔️ Created {filepath}")

def setup_and_run():
    os.chdir(PROJECT_DIR)
    
    print("\n📦 Setting up Python virtual environment...")
    subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
    
    # Determine activation path based on OS
    if sys.platform == "win32":
        pip_path = os.path.join("venv", "Scripts", "pip.exe")
        python_path = os.path.join("venv", "Scripts", "python.exe")
        streamlit_path = os.path.join("venv", "Scripts", "streamlit.exe")
    else:
        pip_path = os.path.join("venv", "bin", "pip")
        python_path = os.path.join("venv", "bin", "python")
        streamlit_path = os.path.join("venv", "bin", "streamlit")

    print("📥 Installing dependencies...")
    subprocess.run([pip_path, "install", "-r", "requirements.txt"], check=True)

    print("\n🚀 Starting FastAPI Backend (Port 8000)...")
    backend_process = subprocess.Popen([
        python_path, "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000"
    ])
    
    time.sleep(3) # Give backend a moment to start
    
    print("🚀 Starting Streamlit Frontend (Port 8501)...")
    frontend_process = subprocess.Popen([
        streamlit_path, "run", "frontend/app.py",
        "--server.address", "127.0.0.1", "--server.port", "8501",
        "--server.headless", "true", "--browser.gatherUsageStats", "false"
    ])

    try:
        while backend_process.poll() is None and frontend_process.poll() is None:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Shutting down servers...")
        backend_process.terminate()
        frontend_process.terminate()

if __name__ == "__main__":
    create_files()
    print("\n⚠️ IMPORTANT: Please replace the placeholder files in the 'backend' and 'frontend' folders with the full code provided in the previous step before using the platform.")
    setup_and_run()