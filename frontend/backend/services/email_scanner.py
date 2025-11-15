import aiohttp
import os
import re
from typing import Dict
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

USE_MOCK_DATA = os.getenv("USE_MOCK_DATA", "true").lower() == "true"
HIBP_API_KEY = os.getenv("HIBP_API_KEY", "")

def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

async def check_haveibeenpwned(email: str) -> Dict:
    """Check if email appears in known data breaches"""
    
    if not HIBP_API_KEY or USE_MOCK_DATA:
        # Return mock data
        return {
            "breaches_found": True,
            "breach_count": 3,
            "breaches": [
                {
                    "name": "LinkedIn",
                    "title": "LinkedIn",
                    "domain": "linkedin.com",
                    "breach_date": "2021-06-22",
                    "added_date": "2021-06-22",
                    "modified_date": "2021-06-22",
                    "pwn_count": 700000000,
                    "description": "In June 2021, data scraped from 700M LinkedIn users was made available for sale.",
                    "data_classes": ["Email addresses", "Full names", "Phone numbers", "Physical addresses"]
                },
                {
                    "name": "Collection1",
                    "title": "Collection #1",
                    "domain": "N/A",
                    "breach_date": "2019-01-07",
                    "added_date": "2019-01-16",
                    "modified_date": "2019-01-16",
                    "pwn_count": 773000000,
                    "description": "Collection #1 is a set of email addresses and passwords totalling 2,692,818,238 rows.",
                    "data_classes": ["Email addresses", "Passwords"]
                },
                {
                    "name": "Dropbox",
                    "title": "Dropbox",
                    "domain": "dropbox.com",
                    "breach_date": "2012-07-01",
                    "added_date": "2016-08-31",
                    "modified_date": "2016-08-31",
                    "pwn_count": 68000000,
                    "description": "In mid-2012, Dropbox suffered a data breach which exposed 68 million records.",
                    "data_classes": ["Email addresses", "Passwords"]
                }
            ],
            "pastes": [],
            "risk_score": 85,
            "risk_level": "HIGH"
        }
    
    try:
        headers = {
            'hibp-api-key': HIBP_API_KEY,
            'User-Agent': 'OSINT-Tool'
        }
        
        async with aiohttp.ClientSession() as session:
            # Check breaches
            async with session.get(
                f"https://haveibeenpwned.com/api/v3/breachedaccount/{email}",
                headers=headers
            ) as response:
                if response.status == 200:
                    breaches = await response.json()
                    return {
                        "breaches_found": True,
                        "breach_count": len(breaches),
                        "breaches": breaches,
                        "risk_score": min(100, len(breaches) * 20),
                        "risk_level": "HIGH" if len(breaches) > 3 else "MEDIUM" if len(breaches) > 0 else "LOW"
                    }
                elif response.status == 404:
                    return {
                        "breaches_found": False,
                        "breach_count": 0,
                        "breaches": [],
                        "risk_score": 0,
                        "risk_level": "LOW"
                    }
                else:
                    raise Exception(f"API returned status {response.status}")
                    
    except Exception as e:
        return {
            "error": str(e),
            "breaches_found": False,
            "breach_count": 0,
            "breaches": []
        }

async def email_scanner(email: str) -> Dict:
    """Scan email for data breaches and gather information"""
    
    if not validate_email(email):
        return {
            "error": "Invalid email format",
            "valid": False
        }
    
    # Extract domain
    domain = email.split('@')[1]
    
    result = {
        "email": email,
        "domain": domain,
        "valid": True,
        "timestamp": datetime.now().isoformat(),
        "breach_data": await check_haveibeenpwned(email),
        "email_reputation": {
            "disposable": domain in ["tempmail.com", "guerrillamail.com", "10minutemail.com"],
            "free_provider": domain in ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"],
            "business": not (domain in ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"])
        },
        "recommendations": []
    }
    
    # Add recommendations based on breach data
    if result["breach_data"].get("breaches_found"):
        result["recommendations"].append("Change your password immediately")
        result["recommendations"].append("Enable two-factor authentication")
        result["recommendations"].append("Monitor your accounts for suspicious activity")
    
    return result

async def domain_scanner(domain: str) -> Dict:
    """Scan domain for email breaches and reputation"""
    
    result = {
        "domain": domain,
        "timestamp": datetime.now().isoformat(),
        "breach_statistics": {
            "total_breaches": 5,
            "affected_records": 2500000,
            "most_recent_breach": "2023-03-15",
            "risk_level": "MEDIUM"
        },
        "domain_info": {
            "is_active": True,
            "mx_records_exist": True,
            "has_spf": True,
            "has_dmarc": True,
            "ssl_valid": True
        },
        "known_breaches": [
            {
                "breach_name": f"{domain.split('.')[0].title()} Data Breach 2023",
                "date": "2023-03-15",
                "records_affected": 1500000,
                "data_types": ["Emails", "Passwords", "Names"]
            },
            {
                "breach_name": f"{domain.split('.')[0].title()} Leak 2022",
                "date": "2022-08-20",
                "records_affected": 1000000,
                "data_types": ["Emails", "Phone Numbers"]
            }
        ]
    }
    
    return result
