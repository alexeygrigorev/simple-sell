from pathlib import Path

FIXTURES_DIR = Path(__file__).parent / "fixtures"


def test_analyze_image(client):
    """Calls the real OpenAI API with an AirPods photo."""
    image_bytes = (FIXTURES_DIR / "airpods.jpg").read_bytes()
    res = client.post(
        "/api/analyze-image",
        files={"image": ("airpods.jpg", image_bytes, "image/jpeg")},
    )
    assert res.status_code == 200
    data = res.json()
    assert "airpods" in data["title"].lower()
    assert data["category"] == "Electronics"
    assert 10 <= data["price"] <= 100
    assert isinstance(data["description"], str)
    assert len(data["description"]) > 10
