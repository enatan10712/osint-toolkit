import json
import os
from datetime import datetime
from typing import Dict, List
import uuid

class SearchHistory:
    def __init__(self, storage_file="./data/search_history.json"):
        self.storage_file = storage_file
        self.history = []
        self._load_history()
    
    def _load_history(self):
        """Load search history from file"""
        os.makedirs(os.path.dirname(self.storage_file), exist_ok=True)
        
        if os.path.exists(self.storage_file):
            try:
                with open(self.storage_file, 'r') as f:
                    self.history = json.load(f)
            except:
                self.history = []
        else:
            self.history = []
    
    def _save_history(self):
        """Save search history to file"""
        try:
            with open(self.storage_file, 'w') as f:
                json.dump(self.history, f, indent=2)
        except Exception as e:
            print(f"Error saving history: {e}")
    
    def add_search(self, search_type: str, query: str, results: Dict):
        """Add a search to history"""
        search_entry = {
            "id": str(uuid.uuid4()),
            "type": search_type,
            "query": query,
            "timestamp": datetime.now().isoformat(),
            "results_summary": self._summarize_results(search_type, results),
            "full_results": results
        }
        
        self.history.insert(0, search_entry)
        
        # Keep only last 100 searches
        if len(self.history) > 100:
            self.history = self.history[:100]
        
        self._save_history()
    
    def _summarize_results(self, search_type: str, results: Dict) -> Dict:
        """Create a summary of search results"""
        summary = {
            "type": search_type,
            "success": not bool(results.get("error"))
        }
        
        if search_type == "username":
            summary["platforms_found"] = len(results.get("found_on", []))
            summary["total_platforms"] = results.get("total_platforms", 0)
        
        elif search_type == "email":
            summary["breaches_found"] = results.get("breach_data", {}).get("breach_count", 0)
            summary["risk_level"] = results.get("breach_data", {}).get("risk_level", "UNKNOWN")
        
        elif search_type == "ip":
            geo = results.get("geolocation", {})
            summary["location"] = f"{geo.get('city', 'N/A')}, {geo.get('country', 'N/A')}"
            summary["organization"] = geo.get('org', 'N/A')
        
        elif search_type == "whois":
            summary["registrar"] = results.get("whois", {}).get("registrar", "N/A")
            summary["age_days"] = results.get("analysis", {}).get("age_days", 0)
        
        elif search_type == "exif":
            summary["exif_found"] = results.get("exif_found", False)
            summary["gps_found"] = bool(results.get("gps"))
        
        return summary
    
    def get_history(self, limit: int = 50) -> List[Dict]:
        """Get search history"""
        return self.history[:limit]
    
    def clear_history(self):
        """Clear all search history"""
        self.history = []
        self._save_history()
    
    def delete_search(self, search_id: str):
        """Delete a specific search from history"""
        self.history = [s for s in self.history if s["id"] != search_id]
        self._save_history()
    
    def get_search_by_id(self, search_id: str) -> Dict:
        """Get a specific search by ID"""
        for search in self.history:
            if search["id"] == search_id:
                return search
        return None
