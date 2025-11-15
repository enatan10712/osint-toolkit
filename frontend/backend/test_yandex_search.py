import os
import tempfile
from yandex_search import YandexImages

def test_yandex_search(image_path):
    """Test Yandex reverse image search"""
    try:
        # Initialize Yandex Images search
        yandex = YandexImages(api_key='')
        
        # Perform reverse image search
        results = yandex.search_by_image(image_path)
        
        print("✅ Successfully performed reverse image search!")
        print(f"Found {len(results)} results:")
        
        for i, result in enumerate(results[:5], 1):
            print(f"\nResult {i}:")
            print(f"URL: {result.get('url', 'N/A')}")
            print(f"Title: {result.get('title', 'N/A')}")
            print(f"Source: {result.get('displayUrl', 'N/A')}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    # Create a temporary test image
    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_img:
        # Write a small transparent PNG
        temp_img.write(b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\x0f\xa0\x84\x8e\x00\x00\x00\x00IEND\xaeB`\x82')
        temp_img_path = temp_img.name
    
    try:
        test_yandex_search(temp_img_path)
    finally:
        # Clean up the temporary file
        try:
            os.unlink(temp_img_path)
        except:
            pass
