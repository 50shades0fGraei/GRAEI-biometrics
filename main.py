from fastapi import FastAPI, WebSocket
from transformers import pipeline
import json
import time
import numpy as np

app = FastAPI()
sentiment = pipeline("sentiment-analysis")

@app.websocket("/biometric")
async def biometric_websocket(websocket: WebSocket):
    await websocket.accept()
    user_data = {
        "text": "", "timestamps": [], "errors": [], "speed": 0,
        "movements": [], "face_data": None, "patience_score": 0
    }
    start_time = time.time()
    while True:
        try:
            data = await websocket.receive_json()
            user_data["text"] += data.get("text", "")
            user_data["timestamps"].append({"char": data.get("char"), "time": time.time() - start_time})
            if data.get("error"):
                user_data["errors"].append(data["error"])
            if data.get("movement"):  # e.g., hesitation or erratic keypress
                user_data["movements"].append(data["movement"])
            if data.get("face_data"):  # Optional facial recognition
                user_data["face_data"] = data["face_data"]
            user_data["speed"] = len(user_data["text"]) / (time.time() - start_time) * 60
            # Calculate patience score based on delays
            delays = [t["time"] - user_data["timestamps"][i-1]["time"] for i, t in enumerate(user_data["timestamps"]) if i > 0]
            user_data["patience_score"] = np.mean(delays) if delays else 0
            await websocket.send_json({"status": "received", "data": user_data})
        except Exception as e:
            await websocket.close()
            breakfrom fastapi import FastAPI, WebSocket
