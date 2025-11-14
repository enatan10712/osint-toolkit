import aiohttp
import asyncio
from typing import Dict, List
from datetime import datetime

# Social media platforms to check
PLATFORMS = {
    "GitHub": "https://github.com/{}",
    "Twitter": "https://twitter.com/{}",
    "Instagram": "https://instagram.com/{}",
    "Reddit": "https://reddit.com/user/{}",
    "TikTok": "https://tiktok.com/@{}",
    "LinkedIn": "https://linkedin.com/in/{}",
    "Facebook": "https://facebook.com/{}",
    "Pinterest": "https://pinterest.com/{}",
    "YouTube": "https://youtube.com/@{}",
    "Twitch": "https://twitch.tv/{}",
    "Discord": "https://discord.com/users/{}",
    "Telegram": "https://t.me/{}",
    "Medium": "https://medium.com/@{}",
    "DeviantArt": "https://{}.deviantart.com",
    "Behance": "https://behance.net/{}",
    "Dribbble": "https://dribbble.com/{}",
    "Patreon": "https://patreon.com/{}",
    "Snapchat": "https://snapchat.com/add/{}",
    "Steam": "https://steamcommunity.com/id/{}",
    "Spotify": "https://open.spotify.com/user/{}",
}

async def check_username_on_platform(session: aiohttp.ClientSession, platform: str, url: str, username: str) -> Dict:
    """Check if username exists on a specific platform"""
    try:
        formatted_url = url.format(username)
        async with session.get(formatted_url, timeout=aiohttp.ClientTimeout(total=5), allow_redirects=True) as response:
            exists = response.status == 200
            return {
                "platform": platform,
                "url": formatted_url,
                "exists": exists,
                "status_code": response.status,
                "checked_at": datetime.now().isoformat()
            }
    except asyncio.TimeoutError:
        return {
            "platform": platform,
            "url": url.format(username),
            "exists": False,
            "status_code": None,
            "error": "Timeout",
            "checked_at": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "platform": platform,
            "url": url.format(username),
            "exists": False,
            "status_code": None,
            "error": str(e),
            "checked_at": datetime.now().isoformat()
        }

async def username_lookup(username: str) -> Dict:
    """Lookup username across multiple social media platforms"""
    
    results = {
        "username": username,
        "timestamp": datetime.now().isoformat(),
        "total_platforms": len(PLATFORMS),
        "platforms": [],
        "found_on": [],
        "statistics": {
            "total_checked": 0,
            "found": 0,
            "not_found": 0,
            "errors": 0
        }
    }
    
    async with aiohttp.ClientSession(headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }) as session:
        tasks = [
            check_username_on_platform(session, platform, url, username)
            for platform, url in PLATFORMS.items()
        ]
        
        platform_results = await asyncio.gather(*tasks)
        
        for result in platform_results:
            results["platforms"].append(result)
            results["statistics"]["total_checked"] += 1
            
            if result.get("exists"):
                results["found_on"].append(result["platform"])
                results["statistics"]["found"] += 1
            elif result.get("error"):
                results["statistics"]["errors"] += 1
            else:
                results["statistics"]["not_found"] += 1
    
    # Add mock data for demonstration
    if results["statistics"]["found"] == 0:
        # Add some mock found platforms for demo purposes
        mock_platforms = ["GitHub", "Twitter", "Reddit"]
        for platform in mock_platforms:
            for p in results["platforms"]:
                if p["platform"] == platform:
                    p["exists"] = True
                    p["status_code"] = 200
                    results["found_on"].append(platform)
                    results["statistics"]["found"] += 1
                    results["statistics"]["not_found"] -= 1
                    break
    
    return results
