from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
from datetime import datetime
import json

from services.username_lookup import username_lookup
from services.email_scanner import email_scanner, domain_scanner
from services.ip_lookup import ip_lookup
from services.whois_lookup import whois_lookup
from services.exif_extractor import extract_exif
from services.report_generator import generate_pdf_report
from services.search_history import SearchHistory
# WiFi features removed per user request
from services.ss7_intelligence import ss7_intelligence_gathering, get_phone_intelligence
from services.ss7_enhanced import ss7_professional_analysis
from services.phone_email_intel import gather_email_intelligence, gather_phone_intelligence
from services.password_analyzer import analyze_password_strength, generate_strong_password
from services.social_media_analyzer import analyze_social_profile, bulk_profile_analysis
from services.network_tools import port_scanner, ssl_certificate_analyzer, dns_enumeration, subdomain_discovery
from services.osint_enhancements import google_dorking, shodan_integration, github_repository_analyzer, email_hunter
from services.geolocation_advanced import advanced_ip_geolocation, photo_location_extractor, timezone_correlator

app = FastAPI(
    title="THE GOD EYE",
    description="Advanced Multi-Mode Intelligence Platform - OSINT | SS7 | WiFi Security",
    version="3.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize search history
search_history = SearchHistory()

# Ensure directories exist
os.makedirs("./reports", exist_ok=True)
os.makedirs("./uploads", exist_ok=True)

# Request Models
class UsernameRequest(BaseModel):
    username: str

class EmailRequest(BaseModel):
    email: str

class DomainRequest(BaseModel):
    domain: str

class IPRequest(BaseModel):
    ip: str

class ReportRequest(BaseModel):
    title: str
    data: Dict[str, Any]
    notes: Optional[str] = ""

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "THE GOD EYE - Advanced Intelligence Platform",
        "version": "3.0.0",
        "status": "operational",
        "warning": "⚠️ FOR AUTHORIZED USE ONLY - LEGAL CONSEQUENCES FOR MISUSE ⚠️",
        "modes": {
            "1": "OSINT Mode - Open Source Intelligence",
            "2": "SS7 Mode - Telecom Intelligence (Educational)"
        },
        "endpoints": [
            "/api/username-lookup",
            "/api/email-scan",
            "/api/domain-scan",
            "/api/ip-lookup",
            "/api/whois-lookup",
            "/api/exif-extract",
            "/api/reverse-image-search",
            "/api/ss7-intel",
            "/api/phone-intel",
            "/api/email-intel",
            "/api/password-analyzer",
            "/api/social-profile-analyzer",
            "/api/port-scan",
            "/api/ssl-analyze",
            "/api/dns-enum",
            "/api/subdomain-discovery",
            "/api/google-dork",
            "/api/shodan-search",
            "/api/github-analyze",
            "/api/geo-locate",
            "/api/photo-location",
            "/api/generate-report",
            "/api/search-history"
        ]
    }

# Username Lookup
@app.post("/api/username-lookup")
async def lookup_username(request: UsernameRequest):
    try:
        results = await username_lookup(request.username)
        search_history.add_search("username", request.username, results)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Email Scanner
@app.post("/api/email-scan")
async def scan_email(request: EmailRequest):
    try:
        results = await email_scanner(request.email)
        search_history.add_search("email", request.email, results)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Domain Scanner
@app.post("/api/domain-scan")
async def scan_domain(request: DomainRequest):
    try:
        results = await domain_scanner(request.domain)
        search_history.add_search("domain", request.domain, results)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# IP Lookup
@app.post("/api/ip-lookup")
async def lookup_ip(request: IPRequest):
    try:
        results = await ip_lookup(request.ip)
        search_history.add_search("ip", request.ip, results)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# WHOIS Lookup
@app.post("/api/whois-lookup")
async def lookup_whois(request: DomainRequest):
    try:
        results = await whois_lookup(request.domain)
        search_history.add_search("whois", request.domain, results)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# EXIF Extraction
@app.post("/api/exif-extract")
async def extract_image_exif(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        results = await extract_exif(contents, file.filename)
        search_history.add_search("exif", file.filename, results)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Generate Report
@app.post("/api/generate-report")
async def generate_report(request: ReportRequest):
    try:
        pdf_path = generate_pdf_report(request.title, request.data, request.notes)
        filename = os.path.basename(pdf_path)
        return {
            "success": True,
            "file_path": pdf_path,
            "download_url": f"/api/download-report/{filename}",
            "filename": filename
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Download Report
@app.get("/api/download-report/{filename}")
async def download_report(filename: str):
    file_path = f"./reports/{filename}"
    if os.path.exists(file_path):
        return FileResponse(
            file_path,
            media_type="application/pdf",
            filename=filename
        )
    raise HTTPException(status_code=404, detail="Report not found")

# Search History
@app.get("/api/search-history")
async def get_search_history(limit: int = 50):
    return search_history.get_history(limit)

# Clear Search History
@app.delete("/api/search-history")
async def clear_search_history():
    search_history.clear_history()
    return {"success": True, "message": "Search history cleared"}

# Delete specific search
@app.delete("/api/search-history/{search_id}")
async def delete_search(search_id: str):
    search_history.delete_search(search_id)
    return {"success": True, "message": "Search deleted"}

# WiFi features removed - focusing on legal OSINT tools

# SS7 Intelligence (Basic)
@app.post("/api/ss7-intel")
async def ss7_intel(request: dict):
    try:
        phone = request.get("phone_number")
        mode = request.get("mode", "info")
        results = await ss7_intelligence_gathering(phone, mode)
        search_history.add_search("ss7", phone, results)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# SS7 Professional Analysis (Advanced)
@app.post("/api/ss7-professional")
async def ss7_professional(request: dict):
    try:
        phone = request.get("phone_number")
        results = await ss7_professional_analysis(phone)
        search_history.add_search("ss7_professional", phone, results)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Phone Intelligence
@app.post("/api/phone-intel")
async def phone_intel(request: dict):
    try:
        phone = request.get("phone_number")
        results = await gather_phone_intelligence(phone)
        search_history.add_search("phone", phone, results)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Email Intelligence
@app.post("/api/email-intel")
async def email_intel(request: dict):
    try:
        email = request.get("email")
        results = await gather_email_intelligence(email)
        search_history.add_search("email_intel", email, results)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Password Analyzer
@app.post("/api/password-analyzer")
async def analyze_password(request: dict):
    try:
        password = request.get("password")
        results = await analyze_password_strength(password)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Generate Strong Password
@app.post("/api/generate-password")
async def generate_password(request: dict):
    try:
        length = request.get("length", 16)
        include_special = request.get("include_special", True)
        results = await generate_strong_password(length, include_special)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Social Media Profile Analyzer
@app.post("/api/social-profile-analyzer")
async def analyze_social(request: dict):
    try:
        platform = request.get("platform")
        username = request.get("username")
        results = await analyze_social_profile(platform, username)
        search_history.add_search("social_profile", f"{platform}/{username}", results)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Port Scanner
@app.post("/api/port-scan")
async def scan_ports(request: dict):
    try:
        target = request.get("target")
        scan_type = request.get("scan_type", "common")
        results = await port_scanner(target, scan_type=scan_type)
        search_history.add_search("port_scan", target, results)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# SSL Certificate Analyzer
@app.post("/api/ssl-analyze")
async def analyze_ssl(request: dict):
    try:
        domain = request.get("domain")
        port = request.get("port", 443)
        results = await ssl_certificate_analyzer(domain, port)
        search_history.add_search("ssl_analysis", domain, results)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# DNS Enumeration
@app.post("/api/dns-enum")
async def enumerate_dns(request: dict):
    try:
        domain = request.get("domain")
        results = await dns_enumeration(domain)
        search_history.add_search("dns_enum", domain, results)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Subdomain Discovery
@app.post("/api/subdomain-discovery")
async def discover_subdomains(request: dict):
    try:
        domain = request.get("domain")
        results = await subdomain_discovery(domain)
        search_history.add_search("subdomain", domain, results)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Google Dorking
@app.post("/api/google-dork")
async def dork_google(request: dict):
    try:
        query = request.get("query")
        dork_type = request.get("type", "general")
        results = await google_dorking(query, dork_type)
        search_history.add_search("google_dork", query, results)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Shodan Integration
@app.post("/api/shodan-search")
async def search_shodan(request: dict):
    try:
        query = request.get("query")
        api_key = request.get("api_key")
        results = await shodan_integration(query, api_key)
        search_history.add_search("shodan", query, results)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# GitHub Analyzer
@app.post("/api/github-analyze")
async def analyze_github(request: dict):
    try:
        username = request.get("username")
        results = await github_repository_analyzer(username)
        search_history.add_search("github", username, results)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Advanced Geolocation
@app.post("/api/geo-locate")
async def geolocate_advanced(request: dict):
    try:
        ip = request.get("ip")
        results = await advanced_ip_geolocation(ip)
        search_history.add_search("geolocation", ip, results)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Photo Location Extractor
@app.post("/api/photo-location")
async def extract_photo_location(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        results = await photo_location_extractor(contents, file.filename)
        search_history.add_search("photo_location", file.filename, results)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Health Check
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "3.0.0",
        "name": "THE GOD EYE",
        "features": {
            "osint": "active",
            "ss7": "educational",
            "wifi": "active",
            "password_analysis": "active",
            "social_media": "active",
            "network_tools": "active",
            "geolocation": "active"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
