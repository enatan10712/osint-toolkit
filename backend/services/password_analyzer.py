import re
import hashlib
import aiohttp
from typing import Dict, List
from datetime import datetime

# Common weak passwords list (top 100)
COMMON_PASSWORDS = [
    "123456", "password", "123456789", "12345678", "12345", "1234567", "password1",
    "123123", "1234567890", "000000", "abc123", "qwerty", "iloveyou", "admin",
    "welcome", "monkey", "login", "starwars", "dragon", "master", "hello", "freedom",
    "whatever", "qazwsx", "trustno1", "654321", "jordan23", "harley", "password123",
    "123321", "qwertyuiop", "superman", "123qwe", "princess", "batman", "solo"
]

async def analyze_password_strength(password: str) -> Dict:
    """Comprehensive password strength analysis"""
    
    result = {
        "password_length": len(password),
        "timestamp": datetime.now().isoformat(),
        "strength_score": 0,
        "strength_level": "",
        "characteristics": {},
        "vulnerabilities": [],
        "recommendations": [],
        "entropy": 0,
        "crack_time_estimates": {},
        "breach_check": {}
    }
    
    # Character type analysis
    has_lowercase = bool(re.search(r'[a-z]', password))
    has_uppercase = bool(re.search(r'[A-Z]', password))
    has_digits = bool(re.search(r'\d', password))
    has_special = bool(re.search(r'[!@#$%^&*()_+\-=\[\]{};:\'",.<>?/\\|`~]', password))
    
    result["characteristics"] = {
        "has_lowercase": has_lowercase,
        "has_uppercase": has_uppercase,
        "has_digits": has_digits,
        "has_special_chars": has_special,
        "length": len(password),
        "unique_chars": len(set(password)),
        "repeated_chars": len(password) - len(set(password))
    }
    
    # Calculate strength score (0-100)
    score = 0
    
    # Length scoring
    if len(password) >= 8:
        score += 20
    if len(password) >= 12:
        score += 15
    if len(password) >= 16:
        score += 15
    
    # Character variety scoring
    if has_lowercase:
        score += 10
    if has_uppercase:
        score += 10
    if has_digits:
        score += 10
    if has_special:
        score += 15
    
    # Penalty for common patterns
    if password.lower() in COMMON_PASSWORDS:
        score = max(0, score - 50)
        result["vulnerabilities"].append("⚠️ CRITICAL: Password is in common password list")
    
    if re.search(r'(.)\1{2,}', password):  # Repeated characters
        score -= 10
        result["vulnerabilities"].append("Repeated characters detected")
    
    if re.search(r'(012|123|234|345|456|567|678|789|890|abc|def|ghi)', password.lower()):
        score -= 10
        result["vulnerabilities"].append("Sequential characters detected")
    
    if re.search(r'(qwer|asdf|zxcv)', password.lower()):
        score -= 10
        result["vulnerabilities"].append("Keyboard pattern detected")
    
    # Common words check
    common_words = ['password', 'admin', 'user', 'login', 'welcome', 'test']
    if any(word in password.lower() for word in common_words):
        score -= 15
        result["vulnerabilities"].append("Contains common words")
    
    result["strength_score"] = max(0, min(100, score))
    
    # Strength level
    if score >= 80:
        result["strength_level"] = "VERY STRONG 🟢"
    elif score >= 60:
        result["strength_level"] = "STRONG 🟡"
    elif score >= 40:
        result["strength_level"] = "MODERATE 🟠"
    elif score >= 20:
        result["strength_level"] = "WEAK 🔴"
    else:
        result["strength_level"] = "VERY WEAK 🔴"
    
    # Calculate entropy
    charset_size = 0
    if has_lowercase:
        charset_size += 26
    if has_uppercase:
        charset_size += 26
    if has_digits:
        charset_size += 10
    if has_special:
        charset_size += 32
    
    if charset_size > 0:
        import math
        result["entropy"] = round(len(password) * math.log2(charset_size), 2)
    
    # Crack time estimates
    if charset_size > 0:
        possible_combinations = charset_size ** len(password)
        
        # Assuming different attack speeds
        result["crack_time_estimates"] = {
            "online_attack": estimate_crack_time(possible_combinations, 1000),  # 1000 attempts/sec
            "offline_slow": estimate_crack_time(possible_combinations, 1_000_000),  # 1M/sec
            "offline_fast": estimate_crack_time(possible_combinations, 1_000_000_000),  # 1B/sec
            "gpu_cluster": estimate_crack_time(possible_combinations, 100_000_000_000)  # 100B/sec
        }
    
    # Recommendations
    if len(password) < 12:
        result["recommendations"].append("✓ Use at least 12 characters (16+ recommended)")
    if not has_uppercase:
        result["recommendations"].append("✓ Add uppercase letters (A-Z)")
    if not has_lowercase:
        result["recommendations"].append("✓ Add lowercase letters (a-z)")
    if not has_digits:
        result["recommendations"].append("✓ Add numbers (0-9)")
    if not has_special:
        result["recommendations"].append("✓ Add special characters (!@#$%^&*)")
    if password.lower() in COMMON_PASSWORDS:
        result["recommendations"].append("✓ URGENT: Change this password immediately!")
    
    # Breach check (HaveIBeenPwned API)
    result["breach_check"] = await check_password_breach(password)
    
    return result


def estimate_crack_time(combinations: int, attempts_per_second: int) -> str:
    """Estimate time to crack password"""
    seconds = combinations / (attempts_per_second * 2)  # Average case
    
    if seconds < 1:
        return "Instant"
    elif seconds < 60:
        return f"{int(seconds)} seconds"
    elif seconds < 3600:
        return f"{int(seconds / 60)} minutes"
    elif seconds < 86400:
        return f"{int(seconds / 3600)} hours"
    elif seconds < 31536000:
        return f"{int(seconds / 86400)} days"
    elif seconds < 31536000 * 100:
        return f"{int(seconds / 31536000)} years"
    else:
        return "Centuries+"


async def check_password_breach(password: str) -> Dict:
    """Check if password appears in known data breaches using HaveIBeenPwned API"""
    
    try:
        # SHA-1 hash of the password
        sha1_hash = hashlib.sha1(password.encode()).hexdigest().upper()
        prefix = sha1_hash[:5]
        suffix = sha1_hash[5:]
        
        # Query HaveIBeenPwned API (k-anonymity model)
        async with aiohttp.ClientSession() as session:
            async with session.get(f"https://api.pwnedpasswords.com/range/{prefix}") as response:
                if response.status == 200:
                    hashes = await response.text()
                    
                    # Check if our hash suffix is in the results
                    for line in hashes.split('\n'):
                        if ':' in line:
                            hash_suffix, count = line.split(':')
                            if hash_suffix == suffix:
                                return {
                                    "found_in_breach": True,
                                    "breach_count": int(count),
                                    "severity": "CRITICAL" if int(count) > 100 else "HIGH",
                                    "message": f"⚠️ This password has been seen {count} times in data breaches!",
                                    "recommendation": "Change this password immediately!"
                                }
                    
                    return {
                        "found_in_breach": False,
                        "breach_count": 0,
                        "severity": "SAFE",
                        "message": "✓ Password not found in known breaches",
                        "recommendation": "Continue using strong, unique passwords"
                    }
    except Exception as e:
        return {
            "found_in_breach": None,
            "error": str(e),
            "message": "Unable to check breach database"
        }
    
    return {
        "found_in_breach": None,
        "message": "Unable to check breach database"
    }


async def generate_strong_password(length: int = 16, include_special: bool = True) -> Dict:
    """Generate a cryptographically strong password"""
    import secrets
    import string
    
    # Character sets
    lowercase = string.ascii_lowercase
    uppercase = string.ascii_uppercase
    digits = string.digits
    special = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    
    # Build character set
    chars = lowercase + uppercase + digits
    if include_special:
        chars += special
    
    # Ensure at least one of each type
    password = [
        secrets.choice(lowercase),
        secrets.choice(uppercase),
        secrets.choice(digits),
    ]
    
    if include_special:
        password.append(secrets.choice(special))
    
    # Fill remaining length
    password.extend(secrets.choice(chars) for _ in range(length - len(password)))
    
    # Shuffle
    import random
    random.shuffle(password)
    password_str = ''.join(password)
    
    # Analyze the generated password
    analysis = await analyze_password_strength(password_str)
    
    return {
        "password": password_str,
        "length": length,
        "strength_analysis": analysis,
        "timestamp": datetime.now().isoformat()
    }
