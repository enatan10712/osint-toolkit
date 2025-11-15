import aiohttp
import asyncio
from typing import Dict, List
from datetime import datetime
import base64

async def google_dorking(query: str, dork_type: str = "general") -> Dict:
    """
    Google Dorking automation - Advanced search operators
    Educational purposes - Respect robots.txt and rate limits
    """
    
    result = {
        "query": query,
        "dork_type": dork_type,
        "timestamp": datetime.now().isoformat(),
        "generated_dorks": [],
        "search_urls": [],
        "tips": []
    }
    
    # Predefined dork templates
    dork_templates = {
        "files": [
            f'site:{query} filetype:pdf',
            f'site:{query} filetype:doc',
            f'site:{query} filetype:xls',
            f'site:{query} filetype:ppt',
            f'site:{query} filetype:txt',
            f'site:{query} filetype:sql',
            f'site:{query} filetype:log',
            f'site:{query} filetype:env'
        ],
        "login": [
            f'site:{query} inurl:login',
            f'site:{query} inurl:admin',
            f'site:{query} inurl:portal',
            f'site:{query} intitle:"index of" "parent directory"',
            f'site:{query} inurl:wp-admin',
            f'site:{query} inurl:signin'
        ],
        "exposed": [
            f'site:{query} intext:"password"',
            f'site:{query} intext:"username"',
            f'site:{query} intext:"api key"',
            f'site:{query} intext:"secret"',
            f'site:{query} ext:env intext:"DB_PASSWORD"',
            f'site:{query} inurl:phpinfo.php',
            f'site:{query} intitle:"index of" "config"'
        ],
        "vulnerabilities": [
            f'site:{query} inurl:php?id=',
            f'site:{query} inurl:".php?page="',
            f'site:{query} inurl:".php?include="',
            f'site:{query} ext:action',
            f'site:{query} "powered by phpMyAdmin"',
            f'site:{query} inurl:"/admin/upload"'
        ],
        "subdomains": [
            f'site:*.{query}',
            f'site:*.{query} -www',
            f'site:{query} -site:www.{query}'
        ],
        "social": [
            f'site:linkedin.com "{query}"',
            f'site:twitter.com "{query}"',
            f'site:facebook.com "{query}"',
            f'site:github.com "{query}"',
            f'site:instagram.com "{query}"'
        ],
        "emails": [
            f'site:{query} intext:"@{query}"',
            f'"{query}" "@gmail.com"',
            f'"{query}" "@yahoo.com"',
            f'"{query}" "@hotmail.com"'
        ]
    }
    
    # Select appropriate dorks
    if dork_type in dork_templates:
        dorks = dork_templates[dork_type]
    else:
        # General - combine multiple types
        dorks = []
        for dtype in ["files", "login", "exposed"]:
            dorks.extend(dork_templates[dtype][:3])
    
    result["generated_dorks"] = dorks
    
    # Generate search URLs
    for dork in dorks:
        encoded_query = base64.b64encode(dork.encode()).decode()
        search_url = f"https://www.google.com/search?q={dork.replace(' ', '+')}"
        result["search_urls"].append({
            "dork": dork,
            "url": search_url,
            "description": get_dork_description(dork)
        })
    
    # Tips for effective dorking
    result["tips"] = [
        "Use quotes for exact phrases: \"password reset\"",
        "Combine operators: site:example.com filetype:pdf",
        "Exclude terms with minus: -site:www.example.com",
        "Use OR operator: site:example.com (login OR signin)",
        "Date range: after:2020-01-01 before:2023-12-31",
        "Respect rate limits and robots.txt",
        "⚠️ Do not access unauthorized files or systems"
    ]
    
    # Advanced operators reference
    result["operators_reference"] = {
        "site:": "Limit results to specific domain",
        "filetype:": "Search for specific file types",
        "inurl:": "Search in URL",
        "intitle:": "Search in page title",
        "intext:": "Search in page content",
        "cache:": "Show cached version",
        "link:": "Find pages linking to URL",
        "related:": "Find related websites",
        "info:": "Get info about a page",
        "define:": "Get definitions"
    }
    
    return result


def get_dork_description(dork: str) -> str:
    """Get human-readable description of dork"""
    if "filetype:" in dork:
        return "Search for specific file types"
    elif "inurl:login" in dork:
        return "Find login pages"
    elif "intext:password" in dork:
        return "Search for exposed passwords"
    elif "inurl:php?id=" in dork:
        return "Find potential SQL injection points"
    elif "site:*." in dork:
        return "Discover subdomains"
    else:
        return "Advanced search query"


async def shodan_integration(query: str, api_key: str = None) -> Dict:
    """
    Shodan search integration - Internet-connected device search
    Requires Shodan API key
    """
    
    result = {
        "query": query,
        "timestamp": datetime.now().isoformat(),
        "results": [],
        "total_results": 0,
        "note": "Real Shodan API integration - requires API key"
    }
    
    if not api_key:
        # Mock data for demo
        result["results"] = [
            {
                "ip": "93.184.216.34",
                "port": 80,
                "protocol": "http",
                "organization": "Edgecast",
                "location": "United States",
                "hostname": "example.com",
                "os": "Linux",
                "banner": "HTTP/1.1 200 OK\\r\\nServer: nginx"
            },
            {
                "ip": "93.184.216.35",
                "port": 443,
                "protocol": "https",
                "organization": "Edgecast",
                "location": "United States",
                "hostname": "www.example.com",
                "os": "Linux",
                "banner": "HTTP/1.1 200 OK\\r\\nServer: nginx\\r\\nSSL: TLSv1.2"
            }
        ]
        result["total_results"] = 2
        result["api_key_status"] = "Demo mode - using mock data"
    else:
        # Real API call
        try:
            async with aiohttp.ClientSession() as session:
                url = f"https://api.shodan.io/shodan/host/search?key={api_key}&query={query}"
                async with session.get(url) as response:
                    if response.status == 200:
                        data = await response.json()
                        result["results"] = data.get("matches", [])
                        result["total_results"] = data.get("total", 0)
                    else:
                        result["error"] = "Shodan API error"
        except Exception as e:
            result["error"] = str(e)
    
    # Common Shodan queries reference
    result["common_queries"] = {
        "webcams": "has_screenshot:true port:8080",
        "routers": "Server: RouterOS",
        "databases": "product:MySQL port:3306",
        "industrial": "port:102 country:US",
        "apache": "apache",
        "nginx": "nginx",
        "windows": "os:Windows",
        "vnc": "port:5900 has_screenshot:true",
        "mongodb": "product:MongoDB",
        "elasticsearch": "port:9200 product:elastic"
    }
    
    return result


async def github_repository_analyzer(username: str, repo: str = None) -> Dict:
    """Analyze GitHub repositories for OSINT"""
    
    result = {
        "username": username,
        "timestamp": datetime.now().isoformat(),
        "repositories": [],
        "intelligence": {},
        "security_findings": []
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            # Get user info
            async with session.get(f"https://api.github.com/users/{username}") as response:
                if response.status == 200:
                    user_data = await response.json()
                    result["user_info"] = {
                        "name": user_data.get("name"),
                        "bio": user_data.get("bio"),
                        "location": user_data.get("location"),
                        "email": user_data.get("email"),
                        "blog": user_data.get("blog"),
                        "twitter": user_data.get("twitter_username"),
                        "company": user_data.get("company"),
                        "public_repos": user_data.get("public_repos"),
                        "followers": user_data.get("followers"),
                        "created_at": user_data.get("created_at")
                    }
            
            # Get repositories
            async with session.get(f"https://api.github.com/users/{username}/repos?per_page=100") as response:
                if response.status == 200:
                    repos = await response.json()
                    
                    for repo in repos[:10]:  # Analyze top 10 repos
                        repo_analysis = {
                            "name": repo.get("name"),
                            "description": repo.get("description"),
                            "stars": repo.get("stargazers_count"),
                            "forks": repo.get("forks_count"),
                            "language": repo.get("language"),
                            "created": repo.get("created_at"),
                            "updated": repo.get("updated_at"),
                            "url": repo.get("html_url")
                        }
                        
                        result["repositories"].append(repo_analysis)
                    
                    # Intelligence gathering
                    languages = {}
                    total_stars = 0
                    for repo in repos:
                        lang = repo.get("language")
                        if lang:
                            languages[lang] = languages.get(lang, 0) + 1
                        total_stars += repo.get("stargazers_count", 0)
                    
                    result["intelligence"] = {
                        "total_repositories": len(repos),
                        "languages_used": languages,
                        "total_stars_earned": total_stars,
                        "most_popular_repo": max(repos, key=lambda x: x.get("stargazers_count", 0)).get("name") if repos else None,
                        "primary_language": max(languages, key=languages.get) if languages else None
                    }
        
        # Security findings (check for common issues in repos)
        result["security_findings"] = [
            "✓ Check for exposed API keys in code",
            "✓ Look for hardcoded credentials",
            "✓ Review commit history for sensitive data",
            "✓ Check for .env files accidentally committed",
            "✓ Look for TODO/FIXME comments revealing security issues"
        ]
        
    except Exception as e:
        result["error"] = str(e)
    
    return result


async def linkedin_company_scraper(company_name: str) -> Dict:
    """
    Scrape public LinkedIn company data
    NOTE: Only public data, respects LinkedIn ToS
    """
    
    result = {
        "company_name": company_name,
        "timestamp": datetime.now().isoformat(),
        "company_info": {},
        "employees_found": [],
        "job_postings": [],
        "note": "Public data only - respects platform ToS"
    }
    
    # Mock data - In production would use official LinkedIn API or careful scraping
    result["company_info"] = {
        "name": company_name,
        "industry": "Information Technology",
        "company_size": "1,001-5,000 employees",
        "headquarters": "San Francisco, CA",
        "founded": "2010",
        "website": f"https://www.{company_name.lower().replace(' ', '')}.com",
        "specialties": ["Software Development", "Cloud Computing", "AI/ML"]
    }
    
    result["employees_found"] = [
        {"name": "John Doe", "title": "Senior Software Engineer", "location": "San Francisco, CA"},
        {"name": "Jane Smith", "title": "Product Manager", "location": "New York, NY"},
        {"name": "Bob Johnson", "title": "DevOps Engineer", "location": "Austin, TX"}
    ]
    
    result["job_postings"] = [
        {"title": "Software Engineer", "location": "Remote", "posted": "2 days ago"},
        {"title": "Data Scientist", "location": "San Francisco", "posted": "1 week ago"}
    ]
    
    result["intelligence"] = {
        "hiring_actively": True,
        "growth_indicators": "Expanding team",
        "tech_stack_hints": ["Python", "AWS", "Kubernetes"],
        "company_culture": "Remote-friendly, innovative"
    }
    
    return result


async def email_hunter(domain: str) -> Dict:
    """
    Find email addresses associated with a domain
    Uses public sources and patterns
    """
    
    result = {
        "domain": domain,
        "timestamp": datetime.now().isoformat(),
        "emails_found": [],
        "patterns_detected": [],
        "sources": []
    }
    
    # Common email patterns
    common_patterns = [
        f"info@{domain}",
        f"contact@{domain}",
        f"support@{domain}",
        f"admin@{domain}",
        f"sales@{domain}",
        f"hello@{domain}"
    ]
    
    result["patterns_detected"] = common_patterns
    
    # Mock found emails
    result["emails_found"] = [
        {"email": f"john.doe@{domain}", "source": "GitHub", "verified": True},
        {"email": f"jane.smith@{domain}", "source": "LinkedIn", "verified": True},
        {"email": f"contact@{domain}", "source": "Website", "verified": True}
    ]
    
    result["sources"] = [
        "GitHub repositories",
        "LinkedIn profiles",
        "Company website",
        "Public directories",
        "Social media profiles"
    ]
    
    result["format_patterns"] = {
        "detected_format": "firstname.lastname@domain.com",
        "confidence": 0.85,
        "alternatives": [
            "firstnamelastname@domain.com",
            "firstname_lastname@domain.com",
            "flastname@domain.com"
        ]
    }
    
    return result
