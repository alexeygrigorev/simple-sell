from datetime import datetime

from pydantic import BaseModel


CATEGORIES = [
    "Electronics",
    "Furniture",
    "Clothing",
    "Vehicles",
    "Sports",
    "Home & Garden",
    "Books",
    "Other",
]


class ListingCreate(BaseModel):
    title: str
    description: str
    price: float
    category: str


class ListingOut(BaseModel):
    id: int
    title: str
    description: str
    price: float
    category: str
    image_url: str
    created_at: datetime

    model_config = {"from_attributes": True}


class AIAnalysisResult(BaseModel):
    title: str
    description: str
    category: str
    price: float
