import os

# Define the backend structure
structure = {
    "backend": {
        ".github": {
            "workflows": ["ci.yml"]
        },
        "prisma": ["schema.prisma", "migrations/"],
        "src": {
            "_files": ["app.ts", "server.ts", "index.ts"],
            "config": ["env.ts", "logger.ts", "prisma.ts", "kafka.ts"],
            "db": [],
            "modules": {
                "auth": {
                    "_files": ["auth.controller.ts", "auth.routes.ts", "auth.service.ts"],
                    "dto": ["login.dto.ts", "signup.dto.ts"],
                    "tests": []
                },
                "users": ["user.service.ts", "user.model.ts", "user.routes.ts"],
                "manufacturing": {
                    "_files": ["mo.controller.ts", "mo.routes.ts", "mo.service.ts"],
                    "dto": []
                },
                "workorder": [],
                "stock": [],
                "bom": [],
                "workcenter": []
            },
            "events": [
                "index.ts",
                "mo.events.ts",
                "wo.events.ts",
                "stock.events.ts",
                "bom.events.ts",
                "workcenter.events.ts",
                "search.indexer.ts"
            ],
            "services": [
                "scheduling.service.ts",
                "vector.service.ts",
                "reporting.service.ts"
            ],
            "libs": ["jwt.ts", "errors.ts", "pagination.ts"],
            "middleware": ["auth.middleware.ts", "error.middleware.ts"],
            "types": ["events.ts"],
            "tests": []
        },
        "scripts": ["db-init.sh", "start-dev.sh"],
        "_files": [
            ".env.example",
            ".eslintrc.cjs",
            ".prettierrc",
            "tsconfig.json",
            "package.json",
            "docker-compose.yml",
            "Dockerfile",
            "README.md"
        ]
    }
}


def create_structure(base_path, structure_dict):
    for name, content in structure_dict.items():
        if name == "_files":
            for file in content:
                file_path = os.path.join(base_path, file)
                # If ends with '/', treat as folder
                if file.endswith("/"):
                    os.makedirs(file_path, exist_ok=True)
                    print(f"Created folder: {file_path}")
                else:
                    with open(file_path, "w") as f:
                        f.write("// " + file + "\n")
                    print(f"Created file: {file_path}")
        elif isinstance(content, dict):
            folder_path = os.path.join(base_path, name)
            os.makedirs(folder_path, exist_ok=True)
            print(f"Created folder: {folder_path}")
            create_structure(folder_path, content)
        elif isinstance(content, list):
            folder_path = os.path.join(base_path, name)
            os.makedirs(folder_path, exist_ok=True)
            print(f"Created folder: {folder_path}")
            for file in content:
                if file.endswith("/"):
                    os.makedirs(os.path.join(folder_path, file), exist_ok=True)
                    print(f"Created folder: {os.path.join(folder_path, file)}")
                else:
                    file_path = os.path.join(folder_path, file)
                    with open(file_path, "w") as f:
                        f.write("// " + file + "\n")
                    print(f"Created file: {file_path}")


if __name__ == "__main__":
    base_dir = os.getcwd()
    create_structure(base_dir, structure)
    print("\n✅ Backend structure created successfully!")
