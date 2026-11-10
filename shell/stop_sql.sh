
#!/bin/bash

CONTAINER="sql1"

if ! docker container inspect "$CONTAINER" >/dev/null 2>&1; then
    echo "[ERROR] Container '$CONTAINER' not found!"
    exit 1
fi

STATUS=$(docker inspect -f '{{.State.Status}}' "$CONTAINER")

if [ "$STATUS" = "running" ]; then
    echo "[INFO] Stopping SQL Server..."

    if docker stop "$CONTAINER"; then
        echo "[OK] SQL Server stopped successfully."
    else
        echo "[ERROR] Failed to stop SQL Server."
        exit 1
    fi
else
    echo "[INFO] SQL Server is already stopped (Status: $STATUS)."
fi
