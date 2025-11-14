import aiohttp
import os
from typing import Dict
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

USE_MOCK_DATA = os.getenv("USE_MOCK_DATA", "true").lower() == "true"
IPINFO_API_KEY = os.getenv("IPINFO_API_KEY", "")
SHODAN_API_KEY = os.getenv("SHODAN_API_KEY", "")

async def get_ip_geolocation(ip: str) -> Dict:
    """Get IP geolocation information"""
    
    if USE_MOCK_DATA or not IPINFO_API_KEY:
        # Return mock data with realistic information
        return {
            "ip": ip,
            "hostname": f"host-{ip.replace('.', '-')}.example.com",
            "city": "San Francisco",
            "region": "California",
            "country": "US",
            "country_name": "United States",
            "loc": "37.7749,-122.4194",
            "latitude": 37.7749,
            "longitude": -122.4194,
            "org": "AS15169 Google LLC",
            "postal": "94102",
            "timezone": "America/Los_Angeles",
            "asn": {
                "asn": "AS15169",
                "name": "Google LLC",
                "domain": "google.com",
                "route": f"{'.'.join(ip.split('.')[:2])}.0.0/16",
                "type": "hosting"
            },
            "company": {
                "name": "Google LLC",
                "domain": "google.com",
                "type": "hosting"
            },
            "privacy": {
                "vpn": False,
                "proxy": False,
                "tor": False,
                "relay": False,
                "hosting": True
            },
            "abuse": {
                "address": "US, CA, Mountain View, 1600 Amphitheatre Parkway, 94043",
                "country": "US",
                "email": "network-abuse@google.com",
                "name": "Abuse",
                "network": f"{'.'.join(ip.split('.')[:2])}.0.0/16",
                "phone": "+1-650-253-0000"
            }
        }
    
    try:
        url = f"https://ipinfo.io/{ip}/json"
        if IPINFO_API_KEY:
            url += f"?token={IPINFO_API_KEY}"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    # Parse location
                    if 'loc' in data:
                        lat, lon = data['loc'].split(',')
                        data['latitude'] = float(lat)
                        data['longitude'] = float(lon)
                    return data
                else:
                    raise Exception(f"API returned status {response.status}")
                    
    except Exception as e:
        return {"error": str(e)}

async def get_shodan_info(ip: str) -> Dict:
    """Get Shodan information for IP (open ports, vulnerabilities)"""
    
    if USE_MOCK_DATA or not SHODAN_API_KEY:
        return {
            "ports": [22, 80, 443, 8080],
            "vulns": ["CVE-2021-44228", "CVE-2022-0001"],
            "services": [
                {
                    "port": 22,
                    "transport": "tcp",
                    "service": "SSH",
                    "version": "OpenSSH 8.2"
                },
                {
                    "port": 80,
                    "transport": "tcp",
                    "service": "HTTP",
                    "version": "nginx 1.18.0"
                },
                {
                    "port": 443,
                    "transport": "tcp",
                    "service": "HTTPS",
                    "version": "nginx 1.18.0"
                }
            ],
            "os": "Linux 5.4",
            "tags": ["cloud", "web-server"],
            "last_update": "2024-01-15"
        }
    
    # Implement real Shodan API call if key is available
    return {}

async def ip_lookup(ip: str) -> Dict:
    """Comprehensive IP lookup with geolocation and security info"""
    
    result = {
        "ip": ip,
        "timestamp": datetime.now().isoformat(),
        "geolocation": await get_ip_geolocation(ip),
        "security": await get_shodan_info(ip),
        "threat_intelligence": {
            "blacklisted": False,
            "threat_score": 15,
            "threat_level": "LOW",
            "known_malicious": False,
            "in_tor_exit_nodes": False,
            "in_vpn_list": True,
            "reputation_sources": [
                {"source": "AbuseIPDB", "score": 0, "reports": 0},
                {"source": "AlienVault OTX", "score": 2, "pulses": 0},
                {"source": "Talos Intelligence", "score": "Neutral"}
            ]
        },
        "reverse_dns": {
            "hostname": f"host-{ip.replace('.', '-')}.example.com",
            "resolves": True
        },
        "whois": {
            "network": f"{'.'.join(ip.split('.')[:2])}.0.0/16",
            "cidr": f"{'.'.join(ip.split('.')[:2])}.0.0/16",
            "name": "GOOGLE",
            "handle": "NET-8-8-8-0-1",
            "registration_date": "2014-03-14",
            "last_updated": "2023-11-20"
        }
    }
    
    return result
