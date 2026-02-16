.PHONY: frontend backend

frontend:
	cd frontend && npm run dev

backend:
	cd backend && uv run uvicorn app.main:app --reload
