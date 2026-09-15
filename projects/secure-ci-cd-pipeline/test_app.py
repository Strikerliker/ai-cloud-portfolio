import unittest

from app import APP_NAME, build_response


class TestApp(unittest.TestCase):
    def test_health_endpoint(self) -> None:
        status, payload = build_response("/health")
        self.assertEqual(status, 200)
        self.assertEqual(payload["status"], "ok")
        self.assertEqual(payload["service"], APP_NAME)

    def test_version_endpoint(self) -> None:
        status, payload = build_response("/version")
        self.assertEqual(status, 200)
        self.assertIn("version", payload)

    def test_unknown_endpoint(self) -> None:
        status, payload = build_response("/missing")
        self.assertEqual(status, 404)
        self.assertEqual(payload, {"error": "not found"})


if __name__ == "__main__":
    unittest.main()
