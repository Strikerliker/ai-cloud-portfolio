from __future__ import annotations

import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer

APP_NAME = "secure-ci-cd-demo"
APP_VERSION = os.getenv("APP_VERSION", "dev")


def build_response(path: str) -> tuple[int, dict[str, str]]:
    if path == "/health":
        return 200, {"status": "ok", "service": APP_NAME}
    if path == "/version":
        return 200, {"service": APP_NAME, "version": APP_VERSION}
    return 404, {"error": "not found"}


class Handler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:  # noqa: N802
        status, payload = build_response(self.path)
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format: str, *args: object) -> None:
        return


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8080"))
    server = HTTPServer(("0.0.0.0", port), Handler)
    print(f"{APP_NAME} listening on port {port}")
    server.serve_forever()
