.PHONY: help install dev clean lint format check test run docker-build docker-run

# Default target
.DEFAULT_GOAL := help

# Variables
PYTHON := python3
UV := uv
DOCKER_IMAGE := idp-service
DOCKER_TAG := latest

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install production dependencies
	$(UV) sync --frozen --no-dev

dev: ## Install all dependencies including dev tools
	$(UV) sync --frozen

clean: ## Clean cache and temporary files
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	rm -rf dist build *.egg-info

lint: ## Run ruff linter
	$(UV) run ruff check --fix app/

format: ## Format code with ruff
	$(UV) run ruff format app/

check: ## Run linter and formatter check
	$(UV) run ruff check app/
	$(UV) run ruff format --check app/

fix: ## Auto-fix linting issues
	$(UV) run ruff check --fix app/
	$(UV) run ruff format app/

test: ## Run unit tests
	$(UV) run pytest tests/ -v

run: ## Run development server
	$(UV) run uvicorn app.main:app --reload --host 0.0.0.0 --port 7860

run-prod: ## Run production server
	$(UV) run uvicorn app.main:app --host 0.0.0.0 --port 7860 --workers 4

docker-build: ## Build Docker image
	docker build -t $(DOCKER_IMAGE):$(DOCKER_TAG) .

docker-run: ## Run Docker container
	docker run -d \
		--name $(DOCKER_IMAGE) \
		-p 7860:7860 \
		-e GROQ_API_KEY=$${GROQ_API_KEY} \
		$(DOCKER_IMAGE):$(DOCKER_TAG)

docker-stop: ## Stop Docker container
	docker stop $(DOCKER_IMAGE) && docker rm $(DOCKER_IMAGE)

docker-logs: ## Show Docker logs
	docker logs -f $(DOCKER_IMAGE)

shell: ## Open Python shell with venv activated
	$(UV) run python

venv: ## Create virtual environment (manual)
	$(UV) venv

lock: ## Update uv.lock file
	$(UV) lock

upgrade: ## Upgrade dependencies
	$(UV) lock --upgrade

health: ## Check API health
	@curl -s http://localhost:8000/api/v1/health | python -m json.tool

all: clean dev lint format test ## Run complete CI pipeline