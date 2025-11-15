<<<<<<< HEAD
# OSINT Toolkit

A powerful Open Source Intelligence (OSINT) toolkit for gathering and analyzing publicly available information.

## 🚀 Features

- **Web Scraping**: Extract and analyze data from various online sources
- **API Integration**: Connect with multiple OSINT data providers
- **Data Visualization**: Interactive dashboards for data analysis
- **Modular Architecture**: Easily extendable with custom modules
- **Secure**: Environment-based configuration for API keys and sensitive data

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: Python, FastAPI
- **Database**: (Add your database here)
- **Deployment**: (Add deployment info here)

## 📦 Prerequisites

- Node.js (v18 or later)
- Python (3.9 or later)
- npm or yarn
- Git

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/osint-toolkit.git
   cd osint-toolkit
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Variables**
   Create a `.env` file in the project root with the following variables:
   ```
   # Backend
   YANDEX_API_KEY=your_yandex_api_key
   YANDEX_FOLDER_ID=your_yandex_folder_id
   
   # Frontend
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

5. **Start the development servers**
   - Backend:
     ```bash
     cd backend
     uvicorn main:app --reload
     ```
   - Frontend (in a new terminal):
     ```bash
     cd frontend
     npm run dev
     ```

## 🌐 API Documentation

Once the backend is running, visit:
- API Docs: http://localhost:8000/docs
- Redoc: http://localhost:8000/redoc

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
=======
# OSINT Frontend

Next.js 14 frontend with modern cyber-themed UI.

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Run development server:**
```bash
npm run dev
```

3. **Build for production:**
```bash
npm run build
npm start
```

## Features

- **Modern UI** - Cyber-themed with neon aesthetics
- **Responsive** - Works on all devices
- **Animated** - Smooth transitions and effects
- **Dark/Light** - Theme toggle support
- **Real-time** - Live status updates

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Framer Motion
- Lucide Icons
>>>>>>> 71c05a44 (fix(css): replace problematic @apply directives in globals.css with plain CSS to avoid build errors)
