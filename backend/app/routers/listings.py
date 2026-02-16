import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Listing
from app.db.schemas import ListingOut, AIAnalysisResult
from app.services.ai import analyze_image_with_ai

router = APIRouter()

UPLOADS_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)


def _listing_to_out(listing: Listing, base_url: str) -> ListingOut:
    image_filename = listing.image_filename
    if image_filename.startswith("http"):
        image_url = image_filename
    else:
        image_url = f"{base_url}/uploads/{image_filename}"
    return ListingOut(
        id=listing.id,
        title=listing.title,
        description=listing.description,
        price=listing.price,
        category=listing.category,
        image_url=image_url,
        created_at=listing.created_at,
    )


@router.get("/api/listings", response_model=list[ListingOut])
def get_listings(
    category: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Listing).order_by(Listing.created_at.desc())
    if category and category != "All":
        query = query.filter(Listing.category == category)
    listings = query.all()
    base_url = "http://localhost:8000"
    return [_listing_to_out(l, base_url) for l in listings]


@router.get("/api/listings/{listing_id}", response_model=ListingOut)
def get_listing(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    base_url = "http://localhost:8000"
    return _listing_to_out(listing, base_url)


@router.post("/api/listings", response_model=ListingOut, status_code=201)
async def create_listing(
    title: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    ext = Path(image.filename).suffix if image.filename else ".jpg"
    filename = f"{uuid.uuid4()}{ext}"
    filepath = UPLOADS_DIR / filename
    contents = await image.read()
    filepath.write_bytes(contents)

    listing = Listing(
        title=title,
        description=description,
        price=price,
        category=category,
        image_filename=filename,
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)

    base_url = "http://localhost:8000"
    return _listing_to_out(listing, base_url)


@router.post("/api/analyze-image", response_model=AIAnalysisResult)
async def analyze_image(image: UploadFile = File(...)):
    contents = await image.read()
    result = await analyze_image_with_ai(contents)
    return result
