import aiohttp
import asyncio
import os
from typing import Dict, List, Optional
from datetime import datetime
import hashlib
import base64
import logging
from yandex_images_downloader import YandexImagesDownloader

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Yandex API Configuration
YANDEX_API_KEY = os.getenv('YANDEX_IMAGES_API_KEY')
MAX_RESULTS = 10  # Maximum number of results to return

async def save_temp_image(image_data: bytes, filename: str) -> str:
    """Save image to temporary file and return path"""
    temp_dir = os.path.join(os.getcwd(), 'temp')
    os.makedirs(temp_dir, exist_ok=True)
    
    file_ext = os.path.splitext(filename)[1] or '.jpg'
    temp_path = os.path.join(temp_dir, f"{hashlib.md5(image_data).hexdigest()}{file_ext}")
    
    with open(temp_path, 'wb') as f:
        f.write(image_data)
        
    return temp_path

async def search_yandex_images(image_path: str) -> Dict:
    """Search for similar images using Yandex API"""
    try:
        downloader = YandexImagesDownloader()
        results = await downloader.search_by_image(
            image_path=image_path,
            limit=MAX_RESULTS
        )
        
        return {
            "status": "success",
            "engine": "Yandex Images",
            "results": results[:MAX_RESULTS],
            "total_results": len(results)
        }
    except Exception as e:
        logger.error(f"Yandex Images API error: {str(e)}")
        return {
            "status": "error",
            "engine": "Yandex Images",
            "error": str(e)
        }

async def reverse_image_search(image_data: bytes, filename: str) -> Dict:
    """Perform reverse image search using Yandex Images API"""
    if not YANDEX_API_KEY:
        return {
            "status": "error",
            "message": "Yandex Images API key not configured",
            "instructions": "Please set YANDEX_IMAGES_API_KEY in your environment variables"
        }
    
    # Generate image hash for reference
    image_hash = hashlib.md5(image_data).hexdigest()
    
    try:
        # Save image to temporary file
        temp_image_path = await save_temp_image(image_data, filename)
        
        # Search Yandex Images
        yandex_results = await search_yandex_images(temp_image_path)
        
        # Clean up temporary file
        try:
            os.remove(temp_image_path)
        except Exception as e:
            logger.warning(f"Failed to remove temp file {temp_image_path}: {e}")
        
        # Prepare response
        result = {
            "status": "success",
            "filename": filename,
            "image_hash": image_hash,
            "file_size": len(image_data),
            "search_engines": [{
                "name": "Yandex Images",
                "status": yandex_results.get("status", "completed"),
                "results_count": yandex_results.get("total_results", 0),
                "error": yandex_results.get("error")
            }],
            "similar_images": yandex_results.get("results", []),
            "metadata": {
                "search_timestamp": datetime.now().isoformat(),
                "api_used": "Yandex Images API"
            }
        }
        
        return result
        
    except Exception as e:
        logger.error(f"Reverse image search failed: {str(e)}")
        return {
            "status": "error",
            "message": f"Reverse image search failed: {str(e)}",
            "filename": filename,
            "image_hash": image_hash
        }
    # Mock similar images (in production, would call actual APIs)
    result["similar_images"] = [
        {
            "url": f"https://example.com/image1.jpg",
            "similarity": 95,
            "source": "Social Media",
            "first_seen": "2023-05-15",
            "dimensions": "1920x1080"
        },
        {
            "url": f"https://example.com/image2.jpg",
            "similarity": 87,
            "source": "News Website",
            "first_seen": "2023-08-20",
            "dimensions": "1280x720"
        },
        {
            "url": f"https://example.com/image3.jpg",
            "similarity": 82,
            "source": "Blog",
            "first_seen": "2024-01-10",
            "dimensions": "800x600"
        }
    ]
    
    # Possible original sources
    result["possible_sources"] = [
        {
            "platform": "Instagram",
            "profile": "@example_user",
            "post_date": "2023-05-15",
            "url": "https://instagram.com/p/example",
            "confidence": 0.85
        },
        {
            "platform": "Twitter",
            "profile": "@user_handle",
            "post_date": "2023-06-20",
            "url": "https://twitter.com/status/example",
            "confidence": 0.72
        },
        {
            "platform": "Facebook",
            "profile": "Example Page",
            "post_date": "2023-05-16",
            "url": "https://facebook.com/photo/example",
            "confidence": 0.68
        }
    ]
    
    # Image analysis
    result["analysis"] = {
        "contains_faces": True,
        "estimated_faces": 2,
        "scene_type": "Outdoor",
        "landmarks_detected": ["Building", "Street"],
        "objects_detected": ["Person", "Car", "Building"],
        "dominant_colors": ["#2C3E50", "#3498DB", "#ECF0F1"],
        "image_quality": "High",
        "potential_manipulation": "None detected"
    }
    
    # OSINT intelligence
    result["intelligence"] = {
        "public_exposure": "High - Found on multiple platforms",
        "first_appearance": "2023-05-15",
        "spread_rate": "Moderate",
        "geographic_indicators": "United States",
        "time_indicators": "Daytime, Summer season",
        "risk_assessment": "Public image - No privacy concerns"
    }
    
    return result
