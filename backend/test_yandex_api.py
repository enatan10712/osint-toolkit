import os
import requests
import base64
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from environment
API_KEY = os.getenv('YANDEX_IMAGES_API_KEY')

def test_yandex_vision():
    url = "https://vision.api.cloud.yandex.net/vision/v1/batchAnalyze"
    
    headers = {
        "Authorization": f"Api-Key {API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Get folder ID from environment
    FOLDER_ID = os.getenv('YANDEX_FOLDER_ID')
    if not FOLDER_ID:
        print("❌ Error: YANDEX_FOLDER_ID not found in .env file")
        return False
        
    # Small base64-encoded 1x1 transparent PNG
    base64_image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
    
    data = {
        "folderId": FOLDER_ID,
        "analyze_specs": [{
            "content": base64_image,
            "features": [{"type": "TEXT_DETECTION"}]
        }]
    }
    
    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()
        print("✅ API Key is valid!")
        print("Response:", response.json())
        return True
    except Exception as e:
        print("❌ Error testing API key:")
        print(f"Status Code: {getattr(e.response, 'status_code', 'N/A')}")
        print(f"Error: {str(e)}")
        if hasattr(e, 'response') and e.response.text:
            print("Response:", e.response.text)
        return False

if __name__ == "__main__":
    if not API_KEY:
        print("❌ Error: YANDEX_IMAGES_API_KEY not found in .env file")
    else:
        print("🔑 Found Yandex API Key")
        print("🚀 Testing API connection...")
        test_yandex_vision()
