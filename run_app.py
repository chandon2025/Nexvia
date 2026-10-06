#!/usr/bin/env python3
"""
AgroResilience - Application Launcher
Launches the FastAPI backend and serves the full React frontend on http://localhost:8000
"""

import sys
import os
import webbrowser
import subprocess
import time

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "backend")

    print("=" * 65)
    print("🌱 AgroResilience - NASA-Powered Smart Crop Rotation Advisor")
    print("=" * 65)
    print("Starting full-stack application on http://127.0.0.1:8000 ...")
    print("Press CTRL+C to stop the server at any time.")
    print("=" * 65)

    # Automatically open browser after 2 seconds
    def open_browser():
        time.sleep(1.8)
        webbrowser.open("http://127.0.0.1:8000")

    import threading
    threading.Thread(target=open_browser, daemon=True).start()

    # Launch uvicorn
    import uvicorn
    sys.path.insert(0, backend_dir)
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False, app_dir=backend_dir)

if __name__ == "__main__":
    main()

