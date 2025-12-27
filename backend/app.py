
from datetime import datetime, timezone
from pathlib import Path
from flask import Flask, jsonify, request, send_from_directory

app = Flask(__name__)
frontend_dir = Path(__file__).resolve().parents[1] / "frontend"

projects = []
next_project_id = 1


def seed_projects():
    global next_project_id
    projects.append(
        {
            "id": next_project_id,
            "name": "Launchpad",
            "description": "Template project with a ready-to-use API surface.",
            "status": "active",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "api_key": "ivp_demo_key_123",
        }
    )
    next_project_id += 1


seed_projects()

@app.route("/")
def home():
    return "IVP backend is running."


@app.get("/app")
def launch_app():
    return send_from_directory(frontend_dir, "index.html")


@app.get("/api/projects")
def list_projects():
    return jsonify({"projects": projects})


@app.post("/api/projects")
def create_project():
    global next_project_id
    payload = request.get_json(silent=True) or {}
    name = payload.get("name", "").strip()
    description = payload.get("description", "").strip()
    if not name:
        return jsonify({"error": "Project name is required."}), 400
    project = {
        "id": next_project_id,
        "name": name,
        "description": description or "No description provided yet.",
        "status": "active",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "api_key": f"ivp_{next_project_id:04d}_key",
    }
    projects.append(project)
    next_project_id += 1
    return jsonify(project), 201


@app.get("/api/projects/<int:project_id>")
def get_project(project_id):
    project = next((item for item in projects if item["id"] == project_id), None)
    if project is None:
        return jsonify({"error": "Project not found."}), 404
    return jsonify(project)


@app.get("/api/quickstart")
def quickstart():
    return jsonify(
        {
            "title": "Streamline new projects with the IVP API",
            "steps": [
                "POST /api/projects to create a new project.",
                "Store the api_key from the response.",
                "GET /api/projects to list all projects.",
                "GET /api/projects/<id> to fetch a specific project.",
            ],
            "examples": {
                "create_project": {
                    "method": "POST",
                    "url": "/api/projects",
                    "body": {
                        "name": "Customer Success Hub",
                        "description": "Unified workspace for onboarding, support, and analytics.",
                    },
                },
                "list_projects": {
                    "method": "GET",
                    "url": "/api/projects",
                },
            },
        }
    )

if __name__ == "__main__":
    app.run(debug=True)
