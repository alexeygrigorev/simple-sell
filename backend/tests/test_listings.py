import io

from PIL import Image


def _make_test_image() -> bytes:
    img = Image.new("RGB", (100, 100), color="red")
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)
    return buf.read()


def test_get_listings(client):
    res = client.get("/api/listings")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 6
    assert data[0]["title"] == "Mid-Century Modern Armchair"


def test_get_listings_by_category(client):
    res = client.get("/api/listings", params={"category": "Electronics"})
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 2
    assert all(item["category"] == "Electronics" for item in data)


def test_get_single_listing(client):
    res = client.get("/api/listings/1")
    assert res.status_code == 200
    data = res.json()
    assert data["title"] == "Mid-Century Modern Armchair"
    assert data["id"] == 1


def test_get_single_listing_not_found(client):
    res = client.get("/api/listings/999")
    assert res.status_code == 404


def test_create_listing(client):
    image_bytes = _make_test_image()
    res = client.post(
        "/api/listings",
        data={
            "title": "Test Item",
            "description": "A test listing",
            "price": "42.50",
            "category": "Other",
        },
        files={"image": ("test.jpg", image_bytes, "image/jpeg")},
    )
    assert res.status_code == 201
    data = res.json()
    assert data["title"] == "Test Item"
    assert data["price"] == 42.50
    assert data["category"] == "Other"
    assert "image_url" in data


def test_create_listing_missing_fields(client):
    res = client.post(
        "/api/listings",
        data={"title": "Incomplete"},
    )
    assert res.status_code == 422
