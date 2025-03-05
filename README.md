# US Non-Immigrant Visa Application Assistant

An AI-powered system to assist with US non-immigrant visa applications, providing intelligent DS-160 form completion, visa consultation, and interview preparation.

## Features

- DS-160 Intelligent Form Filling
  - Smart form completion with Chinese-to-English translation
  - Form validation and suggestions
  - Save/load functionality

- AI Visa Consultation
  - Interactive Q&A system
  - Application evaluation
  - Success rate estimation
  - Mock interview simulation

- Multi-platform Support
  - Web platform
  - WeChat mini-program
  - Mobile app (planned)

## Tech Stack

- Backend: Flask + PostgreSQL
- Frontend: React
- AI: Local deployment of open-source LLM models
- WeChat Mini-program: UniApp

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run the development server:
```bash
python run.py
```

## Project Structure

```
├── backend/
│   ├── api/            # API routes
│   ├── models/         # Database models
│   ├── services/       # Business logic
│   └── core/           # Helper functions
├── frontend/
│   ├── src/
│   └── public/
├── ai/
│   ├── models/         # AI model configurations
│   └── training/       # Training scripts
└── wechat/            # WeChat mini-program
```

## Development Timeline

- Phase 1 (1-3 months): Architecture and basic DS-160 functionality
- Phase 2 (4-6 months): AI features and interview simulation
- Phase 3 (7-9 months): Mobile app and production optimization
