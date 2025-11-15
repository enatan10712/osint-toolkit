import os
import requests
from bs4 import BeautifulSoup
import base64

def test_yandex_reverse_search():
    """Test Yandex reverse image search using web interface"""
    try:
        # URL for Yandex Images
        url = "https://yandex.com/images/search"
        
        # Headers to mimic a browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        # Start a session
        session = requests.Session()
        
        # First, get the main page to get cookies
        response = session.get(url, headers=headers)
        response.raise_for_status()
        
        # Get the upload URL from the page
        soup = BeautifulSoup(response.text, 'html.parser')
        upload_url = soup.find('input', {'name': 'upfile'}).find_parent('form')['action']
        
        # Create a small test image (1x1 transparent PNG)
        image_data = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=')
        
        # Prepare the file for upload
        files = {
            'upfile': ('test.png', image_data, 'image/png')
        }
        
        # Submit the image
        response = session.post(upload_url, files=files, headers=headers)
        response.raise_for_status()
        
        # Print the results
        print("✅ Successfully submitted image to Yandex Images")
        print(f"Status Code: {response.status_code}")
        print("Response URL:", response.url)
        
        # Save the response to a file for inspection
        with open('yandex_response.html', 'w', encoding='utf-8') as f:
            f.write(response.text)
        print("✅ Saved response to yandex_response.html")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        if hasattr(e, 'response') and hasattr(e.response, 'text'):
            print("Response:", e.response.text[:500])  # Print first 500 chars of response

if __name__ == "__main__":
    test_yandex_reverse_search()
