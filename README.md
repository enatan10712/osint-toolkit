# 👁️ THE GOD EYE | Web Intelligence Platform

A cutting-edge web-based intelligence gathering platform combining OSINT and advanced reconnaissance capabilities. THE GOD EYE is built for professional security researchers, penetration testers, and cybersecurity professionals.

## ⚠️ LEGAL DISCLAIMER

**THIS TOOL IS FOR AUTHORIZED USE ONLY**

THE GOD EYE contains powerful intelligence gathering capabilities. Misuse of this tool may result in:
- Federal criminal charges
- Up to 20 years in prison
- Fines up to $250,000
- Civil liability

**ONLY use on systems you own or have explicit written permission to test.**

## ✨ Features

### 🎯 INTELLIGENCE MODES

**OSINT (Open Source Intelligence)**
- **Username Lookup** - Search across 20+ social media platforms (Twitter/X, Instagram, Reddit, GitHub, etc.)
- **Email Intelligence** - Deep dive into email addresses with breach data, social profiles, professional info
- **Phone Intelligence** - Comprehensive phone number analysis with carrier info, location data
- **Domain Scanner** - Analyze domain reputation and breach history
- **IP Lookup** - Get geolocation, threat intelligence, and network information
- **WHOIS Lookup** - Retrieve domain registration and ownership data
- **EXIF Extractor** - Extract hidden metadata from images including GPS coordinates
- **Reverse Image Search** - Search uploaded images across multiple search engines

### 🎨 Advanced Features
- **Modern Web Interface** - Built with Next.js and TailwindCSS
- **Dark/Light Theme** - Cyber-themed UI with easy theme switching
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Real-time Updates** - Live scan updates and notifications
- **Secure Authentication** - JWT-based authentication system

## 🛠️ Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **SQLAlchemy** - Database ORM
- **JWT** - Secure authentication
- **aiohttp** - Async HTTP client

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautifully designed components
- **Axios** - Promise based HTTP client

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/the-god-eye.git
   cd the-god-eye
   ```

2. Set up the backend:
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   # or
   # source venv/bin/activate  # Linux/macOS
   pip install -r requirements.txt
   ```

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   # or
   # yarn install
   ```

4. Configure environment variables:
   - Copy `.env.example` to `.env` in both `backend` and `frontend` directories
   - Add your API keys and configuration

5. Run the application:
   - Start the backend:
     ```bash
     cd backend
     uvicorn main:app --reload
     ```
   - Start the frontend (in a new terminal):
     ```bash
     cd frontend
     npm run dev
     # or
     # yarn dev
     ```

6. Open your browser to [http://localhost:3000](http://localhost:3000)

## 📝 License

This project is for educational and portfolio purposes. Use responsibly and ethically.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## 📧 Contact

For questions or concerns, please open an issue on GitHub.

## 🙏 Acknowledgments

- All the amazing open-source projects that made this possible
- The security research community for their valuable contributions

## 🔑 API Keys (Optional)

The platform works with mock data by default. For real data, obtain API keys from:

- **IPInfo** - https://ipinfo.io/ (IP geolocation)
- **HaveIBeenPwned** - https://haveibeenpwned.com/API/Key (breach data)
- **WhoisXML** - https://whoisxmlapi.com/ (WHOIS data)
- **Shodan** - https://shodan.io/ (security intelligence)

Add your API keys to `backend/.env` and set `USE_MOCK_DATA=false` to enable real data.
  "ip": "8.8.8.8"
}
```

### WHOIS Lookup
```http
POST /api/whois-lookup
Content-Type: application/json

{
  "domain": "example.com"
}
```

### EXIF Extraction
```http
POST /api/exif-extract
Content-Type: multipart/form-data

file: <image file>
```

### Generate Report
```http
POST /api/generate-report
Content-Type: application/json

{
  "title": "Investigation Report",
  "data": { ...investigation data... },
  "notes": "Analyst notes here"
}
```

## 🎯 Use Cases

- **Cybersecurity Research** - Gather intelligence on potential threats
- **Digital Forensics** - Investigate digital footprints and metadata
- **OSINT Training** - Learn and practice open-source intelligence techniques
- **Portfolio Projects** - Showcase advanced full-stack development skills
- **Penetration Testing** - Reconnaissance phase of ethical hacking
- **Incident Response** - Gather information during security incidents

## ⚖️ Legal & Ethical Use

**IMPORTANT**: This tool is designed for:
- ✅ Legal cybersecurity research
- ✅ Authorized penetration testing
- ✅ Personal OSINT practice
- ✅ Educational purposes
- ✅ Portfolio demonstrations

**Do NOT use for:**
- ❌ Unauthorized access to systems
- ❌ Harassment or stalking
- ❌ Illegal surveillance
- ❌ Any malicious activities

**Always obtain proper authorization before conducting security research on systems you don't own.**

## 🎨 Features Showcase

### Futuristic UI
- Neon blue and dark grey cyber theme
- Animated scanning effects with terminal-style loaders
- Smooth transitions and hover effects
- Glassmorphism cards and gradient borders

### Real-time Updates
- Live status indicators
- Progress animations during scans
- Instant result rendering
- Dynamic data visualization

### Professional Reports
- PDF export with custom branding
- Structured investigation data
- Analyst notes section
- Timestamp and metadata

## 🔧 Development

### Project Structure
```
osint/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example        # Environment variables template
│   └── services/           # OSINT service modules
│       ├── username_lookup.py
│       ├── email_scanner.py
│       ├── ip_lookup.py
│       ├── whois_lookup.py
│       ├── exif_extractor.py
│       ├── report_generator.py
│       └── search_history.py
│
└── frontend/
    ├── app/                # Next.js app directory
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
    ├── components/         # React components
    │   ├── Dashboard.tsx
    │   ├── Header.tsx
    │   ├── Sidebar.tsx
    │   ├── ThemeProvider.tsx
    │   ├── TerminalLoader.tsx
    │   └── tools/          # Tool components
    ├── lib/               # Utilities
    │   └── api.ts
    ├── package.json
    └── tailwind.config.js
```

### Adding New Tools

1. Create a new service in `backend/services/`
2. Add endpoint to `backend/main.py`
3. Create component in `frontend/components/tools/`
4. Add to navigation in `frontend/components/Sidebar.tsx`
5. Update routing in `frontend/app/page.tsx`

## 📝 License

This project is for educational and portfolio purposes. Use responsibly and ethically.

## 🤝 Contributing

Feel free to fork, modify, and enhance this project for your own use.

## 📧 Contact

For questions or collaboration:
- Create an issue on GitHub
- Use for educational purposes only

---

**Remember**: With great power comes great responsibility. Use OSINT tools ethically and legally. 🛡️
