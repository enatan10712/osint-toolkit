import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
API_KEY = os.getenv('YANDEX_IMAGES_API_KEY')
FOLDER_ID = os.getenv('YANDEX_FOLDER_ID')
IAM_TOKEN = None

def get_iam_token():
    """Get IAM token using API key"""
    url = "https://iam.api.cloud.yandex.net/iam/v1/tokens"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    data = {
        "yandexPassportOauthToken": API_KEY
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        return response.json().get('iamToken')
    except Exception as e:
        print(f"❌ Error getting IAM token: {str(e)}")
        if hasattr(e, 'response') and e.response.text:
            print("Response:", e.response.text)
        return None

def test_vision_api():
    """Test Yandex Vision API"""
    global IAM_TOKEN
    
    if not API_KEY or not FOLDER_ID:
        print("❌ Error: Missing required environment variables")
        print("Please set YANDEX_IMAGES_API_KEY and YANDEX_FOLDER_ID in .env file")
        return
    
    # Get IAM token if not already available
    if not IAM_TOKEN:
        print("🔑 Getting IAM token...")
        IAM_TOKEN = get_iam_token()
        if not IAM_TOKEN:
            return
    
    print("🚀 Testing Vision API...")
    
    url = "https://vision.api.cloud.yandex.net/vision/v1/batchAnalyze"
    
    headers = {
        "Authorization": f"Bearer {IAM_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # Small base64-encoded 1x1 transparent PNG
    data = {
        "folderId": FOLDER_ID,
        "analyze_specs": [{
            "content": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
            "features": [{
                "type": "TEXT_DETECTION",
                "text_detection_config": {
                    "language_codes": ["*"],
                    "model": "page"
                }
            }]
        }]
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        
        print("✅ Successfully connected to Yandex Vision API!")
        print("Response:", json.dumps(response.json(), indent=2))
        
    except requests.exceptions.HTTPError as http_err:
        print(f"❌ HTTP error occurred: {http_err}")
        if hasattr(http_err, 'response') and http_err.response.text:
            print("Response:", http_err.response.text)
    except Exception as e:
        print(f"❌ An error occurred: {str(e)}")

if __name__ == "__main__":
    test_vision_api()
