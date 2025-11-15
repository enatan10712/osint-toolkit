import aiohttp
from typing import Dict, List
from datetime import datetime
import re
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
import io

async def advanced_ip_geolocation(ip: str) -> Dict:
    """
    Advanced IP geolocation with mapping data
    """
    
    result = {
        "ip": ip,
        "timestamp": datetime.now().isoformat(),
        "location": {},
        "map_data": {},
        "network_info": {},
        "timezone_info": {},
        "weather_info": {},
        "nearby_locations": []
    }
    
    # Mock geolocation data (in production, use ipinfo.io or similar)
    result["location"] = {
        "city": "San Francisco",
        "region": "California",
        "country": "United States",
        "country_code": "US",
        "continent": "North America",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "postal_code": "94103",
        "accuracy_radius": 1000  # meters
    }
    
    # Map visualization data
    result["map_data"] = {
        "center": {
            "lat": 37.7749,
            "lng": -122.4194
        },
        "zoom_level": 12,
        "marker_position": {
            "lat": 37.7749,
            "lng": -122.4194
        },
        "map_style": "terrain",
        "google_maps_url": f"https://www.google.com/maps?q={37.7749},{-122.4194}",
        "openstreetmap_url": f"https://www.openstreetmap.org/?mlat={37.7749}&mlon={-122.4194}&zoom=12"
    }
    
    # Network information
    result["network_info"] = {
        "asn": "AS15169",
        "organization": "Google LLC",
        "isp": "Google Fiber",
        "connection_type": "Broadband",
        "is_proxy": False,
        "is_vpn": False,
        "is_tor": False,
        "is_datacenter": False,
        "is_mobile": False
    }
    
    # Timezone information
    result["timezone_info"] = {
        "timezone": "America/Los_Angeles",
        "utc_offset": "-08:00",
        "current_time": "2024-01-15 14:30:00",
        "is_dst": False,
        "timezone_abbreviation": "PST"
    }
    
    # Local weather (approximate)
    result["weather_info"] = {
        "temperature": "18°C / 64°F",
        "condition": "Partly Cloudy",
        "humidity": "65%",
        "wind_speed": "12 km/h",
        "sunrise": "07:15 AM",
        "sunset": "05:45 PM"
    }
    
    # Nearby points of interest
    result["nearby_locations"] = [
        {
            "name": "Golden Gate Bridge",
            "distance": "5.2 km",
            "type": "Landmark",
            "coordinates": {"lat": 37.8199, "lng": -122.4783}
        },
        {
            "name": "Fisherman's Wharf",
            "distance": "3.8 km",
            "type": "Tourist Attraction",
            "coordinates": {"lat": 37.8080, "lng": -122.4177}
        },
        {
            "name": "Alcatraz Island",
            "distance": "6.1 km",
            "type": "Historic Site",
            "coordinates": {"lat": 37.8267, "lng": -122.4230}
        }
    ]
    
    return result


async def photo_location_extractor(image_data: bytes, filename: str) -> Dict:
    """
    Extract GPS coordinates from photo and provide map visualization
    """
    
    result = {
        "filename": filename,
        "timestamp": datetime.now().isoformat(),
        "gps_data": {},
        "location_info": {},
        "map_data": {},
        "photo_metadata": {},
        "warnings": []
    }
    
    try:
        # Open image
        image = Image.open(io.BytesIO(image_data))
        
        # Extract EXIF data
        exif_data = image._getexif()
        
        if exif_data:
            # Get GPS info
            gps_info = {}
            for tag, value in exif_data.items():
                tag_name = TAGS.get(tag, tag)
                if tag_name == "GPSInfo":
                    for gps_tag in value:
                        gps_tag_name = GPSTAGS.get(gps_tag, gps_tag)
                        gps_info[gps_tag_name] = value[gps_tag]
            
            if gps_info:
                # Convert GPS coordinates
                lat = convert_gps_to_decimal(gps_info.get("GPSLatitude"), gps_info.get("GPSLatitudeRef"))
                lng = convert_gps_to_decimal(gps_info.get("GPSLongitude"), gps_info.get("GPSLongitudeRef"))
                
                if lat and lng:
                    result["gps_data"] = {
                        "latitude": lat,
                        "longitude": lng,
                        "altitude": gps_info.get("GPSAltitude", "Unknown"),
                        "timestamp": gps_info.get("GPSTimeStamp", "Unknown"),
                        "coordinates_string": f"{lat}, {lng}"
                    }
                    
                    # Reverse geocode to get location name
                    location_info = await reverse_geocode(lat, lng)
                    result["location_info"] = location_info
                    
                    # Map data
                    result["map_data"] = {
                        "center": {"lat": lat, "lng": lng},
                        "marker": {"lat": lat, "lng": lng},
                        "zoom": 15,
                        "google_maps_url": f"https://www.google.com/maps?q={lat},{lng}",
                        "apple_maps_url": f"http://maps.apple.com/?q={lat},{lng}",
                        "openstreetmap_url": f"https://www.openstreetmap.org/?mlat={lat}&mlon={lng}&zoom=15"
                    }
                    
                    result["warnings"].append("⚠️ GPS coordinates found - Photo location is exposed!")
                else:
                    result["warnings"].append("GPS data present but coordinates couldn't be parsed")
            else:
                result["warnings"].append("✓ No GPS data found in image")
        
        # Photo metadata
        result["photo_metadata"] = {
            "format": image.format,
            "size": f"{image.width}x{image.height}",
            "mode": image.mode,
            "file_size": len(image_data)
        }
        
        # Extract camera info if available
        if exif_data:
            result["camera_info"] = {
                "make": exif_data.get(271, "Unknown"),  # Make
                "model": exif_data.get(272, "Unknown"),  # Model
                "datetime": exif_data.get(306, "Unknown"),  # DateTime
                "software": exif_data.get(305, "Unknown")  # Software
            }
    
    except Exception as e:
        result["error"] = str(e)
        result["warnings"].append("Error extracting GPS data from image")
    
    return result


def convert_gps_to_decimal(coords, ref):
    """Convert GPS coordinates to decimal format"""
    if not coords:
        return None
    
    try:
        degrees = float(coords[0])
        minutes = float(coords[1])
        seconds = float(coords[2])
        
        decimal = degrees + (minutes / 60.0) + (seconds / 3600.0)
        
        if ref in ['S', 'W']:
            decimal = -decimal
        
        return round(decimal, 6)
    except:
        return None


async def reverse_geocode(lat: float, lng: float) -> Dict:
    """
    Reverse geocode coordinates to get location information
    """
    
    # Mock data - In production, use Google Maps API or Nominatim
    return {
        "address": "123 Market St, San Francisco, CA 94103, USA",
        "city": "San Francisco",
        "state": "California",
        "country": "United States",
        "postal_code": "94103",
        "neighborhood": "SoMa",
        "formatted_address": "123 Market St, San Francisco, CA 94103"
    }


async def timezone_correlator(locations: List[Dict]) -> Dict:
    """
    Correlate multiple locations by timezone to find patterns
    """
    
    result = {
        "timestamp": datetime.now().isoformat(),
        "locations_analyzed": len(locations),
        "timezone_analysis": {},
        "patterns_detected": [],
        "timeline": [],
        "geographic_spread": {}
    }
    
    # Analyze timezones
    timezones = {}
    for loc in locations:
        tz = loc.get("timezone", "Unknown")
        if tz not in timezones:
            timezones[tz] = []
        timezones[tz].append(loc)
    
    result["timezone_analysis"] = {
        "unique_timezones": len(timezones),
        "timezone_distribution": {tz: len(locs) for tz, locs in timezones.items()},
        "most_common_timezone": max(timezones, key=lambda x: len(timezones[x])) if timezones else None
    }
    
    # Detect patterns
    if len(timezones) == 1:
        result["patterns_detected"].append("All locations in same timezone - likely same geographic region")
    elif len(timezones) > 5:
        result["patterns_detected"].append("Multiple timezones detected - international activity")
    
    # Geographic spread
    if locations:
        lats = [loc.get("latitude", 0) for loc in locations if loc.get("latitude")]
        lngs = [loc.get("longitude", 0) for loc in locations if loc.get("longitude")]
        
        if lats and lngs:
            result["geographic_spread"] = {
                "center_point": {
                    "lat": sum(lats) / len(lats),
                    "lng": sum(lngs) / len(lngs)
                },
                "bounding_box": {
                    "north": max(lats),
                    "south": min(lats),
                    "east": max(lngs),
                    "west": min(lngs)
                },
                "span_km": calculate_distance(min(lats), min(lngs), max(lats), max(lngs))
            }
    
    return result


def calculate_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """
    Calculate distance between two coordinates (Haversine formula)
    """
    from math import radians, sin, cos, sqrt, atan2
    
    R = 6371  # Earth's radius in km
    
    lat1, lng1, lat2, lng2 = map(radians, [lat1, lng1, lat2, lng2])
    dlat = lat2 - lat1
    dlng = lng2 - lng1
    
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlng/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    distance = R * c
    
    return round(distance, 2)


async def location_history_analyzer(locations: List[Dict]) -> Dict:
    """
    Analyze location history to detect patterns and movements
    """
    
    result = {
        "timestamp": datetime.now().isoformat(),
        "total_locations": len(locations),
        "analysis": {},
        "movement_patterns": [],
        "frequent_locations": [],
        "travel_summary": {}
    }
    
    if not locations:
        return result
    
    # Analyze movement patterns
    if len(locations) > 1:
        # Calculate distances between consecutive locations
        total_distance = 0
        for i in range(len(locations) - 1):
            if all(k in locations[i] and k in locations[i+1] for k in ['latitude', 'longitude']):
                dist = calculate_distance(
                    locations[i]['latitude'], locations[i]['longitude'],
                    locations[i+1]['latitude'], locations[i+1]['longitude']
                )
                total_distance += dist
        
        result["travel_summary"] = {
            "total_distance_km": round(total_distance, 2),
            "average_distance_per_move": round(total_distance / (len(locations) - 1), 2),
            "locations_visited": len(locations)
        }
    
    # Find most frequent locations
    location_counts = {}
    for loc in locations:
        city = loc.get("city", "Unknown")
        location_counts[city] = location_counts.get(city, 0) + 1
    
    result["frequent_locations"] = sorted(
        [{"location": k, "visits": v} for k, v in location_counts.items()],
        key=lambda x: x["visits"],
        reverse=True
    )[:5]
    
    # Detect patterns
    if location_counts:
        most_visited = max(location_counts, key=location_counts.get)
        result["movement_patterns"].append(f"Most frequently visited: {most_visited}")
    
    return result


async def create_location_heatmap(locations: List[Dict]) -> Dict:
    """
    Generate heatmap data for location visualization
    """
    
    result = {
        "timestamp": datetime.now().isoformat(),
        "heatmap_points": [],
        "center": {},
        "bounds": {},
        "visualization_url": ""
    }
    
    # Extract coordinates
    points = []
    for loc in locations:
        if "latitude" in loc and "longitude" in loc:
            points.append({
                "lat": loc["latitude"],
                "lng": loc["longitude"],
                "weight": loc.get("weight", 1)
            })
    
    result["heatmap_points"] = points
    
    if points:
        # Calculate center
        avg_lat = sum(p["lat"] for p in points) / len(points)
        avg_lng = sum(p["lng"] for p in points) / len(points)
        
        result["center"] = {"lat": avg_lat, "lng": avg_lng}
        
        # Calculate bounds
        lats = [p["lat"] for p in points]
        lngs = [p["lng"] for p in points]
        
        result["bounds"] = {
            "north": max(lats),
            "south": min(lats),
            "east": max(lngs),
            "west": min(lngs)
        }
        
        # Google Maps heatmap URL (example)
        result["visualization_url"] = f"https://www.google.com/maps/@{avg_lat},{avg_lng},12z"
    
    return result
