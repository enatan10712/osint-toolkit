# OSINT Backend API

FastAPI-based backend for the OSINT Intelligence Platform.

## Quick Start

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Configure environment:**
```bash
copy .env.example .env
```

3. **Run the server:**
```bash
python main.py
```

Server runs on `http://localhost:8000`

## API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI).

## Services

- **username_lookup.py** - Social media platform searches
- **email_scanner.py** - Breach database checks
- **ip_lookup.py** - IP geolocation and threat intel
- **whois_lookup.py** - Domain registration info
- **exif_extractor.py** - Image metadata extraction
- **report_generator.py** - PDF report creation
- **search_history.py** - Investigation history tracking
