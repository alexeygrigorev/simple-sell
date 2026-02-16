from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.db.models import Listing

SEED_LISTINGS = [
    {
        "title": "Mid-Century Modern Armchair",
        "description": "Beautiful walnut frame armchair with original green velvet upholstery. Minor wear consistent with age. Very comfortable.",
        "price": 320,
        "category": "Furniture",
        "image_filename": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
        "created_at": datetime(2026, 2, 15, 10, 0, 0, tzinfo=timezone.utc),
    },
    {
        "title": "iPhone 15 Pro Max 256GB",
        "description": "Like new condition, natural titanium. Comes with original box, cable, and a clear case. Battery health 98%.",
        "price": 899,
        "category": "Electronics",
        "image_filename": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=400&fit=crop",
        "created_at": datetime(2026, 2, 14, 14, 30, 0, tzinfo=timezone.utc),
    },
    {
        "title": "Vintage Levi's 501 Jeans",
        "description": "Authentic vintage 501s from the 90s. W32 L34. Great fade and distressing. No rips or tears.",
        "price": 85,
        "category": "Clothing",
        "image_filename": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=400&fit=crop",
        "created_at": datetime(2026, 2, 14, 9, 15, 0, tzinfo=timezone.utc),
    },
    {
        "title": "Trek Domane SL 5 Road Bike",
        "description": "2024 model, size 56cm. Shimano 105 groupset. Under 500 miles. Includes bottle cages and pedals.",
        "price": 2200,
        "category": "Sports",
        "image_filename": "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&h=400&fit=crop",
        "created_at": datetime(2026, 2, 13, 16, 0, 0, tzinfo=timezone.utc),
    },
    {
        "title": "Sony WH-1000XM5 Headphones",
        "description": "Excellent noise cancelling headphones. Silver color. Includes carrying case and cable. Like new.",
        "price": 220,
        "category": "Electronics",
        "image_filename": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=400&fit=crop",
        "created_at": datetime(2026, 2, 13, 11, 0, 0, tzinfo=timezone.utc),
    },
    {
        "title": "Monstera Deliciosa Plant",
        "description": "Large healthy monstera with 3 splits. About 3 feet tall. Comes in ceramic pot. Pet-free home.",
        "price": 45,
        "category": "Home & Garden",
        "image_filename": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=600&h=400&fit=crop",
        "created_at": datetime(2026, 2, 12, 8, 0, 0, tzinfo=timezone.utc),
    },
]


def seed_db(db: Session) -> None:
    if db.query(Listing).count() > 0:
        return
    for data in SEED_LISTINGS:
        db.add(Listing(**data))
    db.commit()
