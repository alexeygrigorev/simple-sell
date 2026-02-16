import base64

from openai import AsyncOpenAI

from app.db.schemas import AIAnalysisResult, CATEGORIES

SYSTEM_PROMPT = f"""You are an assistant that analyzes images of items for a marketplace listing.
Given an image, suggest:
- A concise, appealing title
- A detailed description (2-3 sentences)
- A category from this list: {", ".join(CATEGORIES)}
- A fair price in euros

Respond with valid JSON matching this schema:
{{"title": "string", "description": "string", "category": "string", "price": number}}
"""


async def analyze_image_with_ai(image_bytes: bytes) -> AIAnalysisResult:
    client = AsyncOpenAI()
    b64 = base64.b64encode(image_bytes).decode("utf-8")

    response = await client.responses.parse(
        model="gpt-4o-mini",
        input=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_image",
                        "image_url": f"data:image/jpeg;base64,{b64}",
                    },
                    {
                        "type": "input_text",
                        "text": "Analyze this item for a marketplace listing.",
                    },
                ],
            },
        ],
        text_format=AIAnalysisResult,
    )

    return response.output_parsed
