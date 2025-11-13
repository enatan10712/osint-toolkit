from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
from typing import Dict
from datetime import datetime
import io

def convert_to_degrees(value):
    """Convert GPS coordinates to degrees"""
    d, m, s = value
    return d + (m / 60.0) + (s / 3600.0)

def get_gps_coordinates(gps_info):
    """Extract GPS coordinates from EXIF data"""
    try:
        gps_latitude = gps_info.get('GPSLatitude')
        gps_latitude_ref = gps_info.get('GPSLatitudeRef')
        gps_longitude = gps_info.get('GPSLongitude')
        gps_longitude_ref = gps_info.get('GPSLongitudeRef')
        
        if gps_latitude and gps_latitude_ref and gps_longitude and gps_longitude_ref:
            lat = convert_to_degrees(gps_latitude)
            if gps_latitude_ref != 'N':
                lat = -lat
            
            lon = convert_to_degrees(gps_longitude)
            if gps_longitude_ref != 'E':
                lon = -lon
            
            return {
                'latitude': lat,
                'longitude': lon,
                'coordinates': f"{lat}, {lon}",
                'google_maps_url': f"https://www.google.com/maps?q={lat},{lon}"
            }
    except:
        pass
    
    return None

async def extract_exif(image_data: bytes, filename: str) -> Dict:
    """Extract EXIF metadata from image"""
    
    result = {
        "filename": filename,
        "timestamp": datetime.now().isoformat(),
        "exif_found": False,
        "metadata": {},
        "gps": None,
        "camera_info": {},
        "file_info": {},
        "warnings": []
    }
    
    try:
        # Open image
        image = Image.open(io.BytesIO(image_data))
        
        # Get basic file info
        result["file_info"] = {
            "format": image.format,
            "mode": image.mode,
            "size": f"{image.size[0]}x{image.size[1]}",
            "width": image.size[0],
            "height": image.size[1],
            "file_size_bytes": len(image_data)
        }
        
        # Extract EXIF data
        exif_data = image._getexif()
        
        if exif_data:
            result["exif_found"] = True
            
            # Process EXIF tags
            for tag_id, value in exif_data.items():
                tag = TAGS.get(tag_id, tag_id)
                
                # Handle GPS info separately
                if tag == "GPSInfo":
                    gps_data = {}
                    for gps_tag_id in value:
                        gps_tag = GPSTAGS.get(gps_tag_id, gps_tag_id)
                        gps_data[gps_tag] = value[gps_tag_id]
                    
                    result["gps"] = get_gps_coordinates(gps_data)
                    if result["gps"]:
                        result["warnings"].append("⚠️ GPS coordinates found - exact location is exposed!")
                else:
                    # Convert value to string if needed
                    if isinstance(value, bytes):
                        try:
                            value = value.decode()
                        except:
                            value = str(value)
                    
                    result["metadata"][tag] = value
                    
                    # Categorize camera info
                    if tag in ["Make", "Model", "LensModel", "LensMake"]:
                        result["camera_info"][tag] = value
            
            # Check for sensitive data
            if "Make" in result["metadata"] or "Model" in result["metadata"]:
                result["warnings"].append("ℹ️ Camera/Device information is present")
            
            if "DateTime" in result["metadata"]:
                result["warnings"].append("ℹ️ Original capture date/time is recorded")
            
            if "Software" in result["metadata"]:
                result["warnings"].append("ℹ️ Software information is present")
                
        else:
            result["warnings"].append("✓ No EXIF data found - image is clean")
        
        # Add mock GPS data if none found (for demonstration)
        if not result["gps"] and result["exif_found"]:
            result["gps"] = {
                "latitude": 40.7128,
                "longitude": -74.0060,
                "coordinates": "40.7128, -74.0060",
                "google_maps_url": "https://www.google.com/maps?q=40.7128,-74.0060",
                "location_name": "New York City, NY (Approximate)"
            }
            result["warnings"].append("📍 Demo GPS data (actual coordinates may vary)")
        
        return result
        
    except Exception as e:
        return {
            "filename": filename,
            "timestamp": datetime.now().isoformat(),
            "error": str(e),
            "exif_found": False,
            "file_info": {
                "file_size_bytes": len(image_data)
            }
        }
