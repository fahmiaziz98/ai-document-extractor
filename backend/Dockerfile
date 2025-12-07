FROM python:3.11-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m -u 1000 user

WORKDIR /app
RUN chown user:user /app

USER user

COPY --chown=user pyproject.toml uv.lock ./

RUN uv sync --frozen --no-cache --no-dev

COPY --chown=user app ./app

ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 7860

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]