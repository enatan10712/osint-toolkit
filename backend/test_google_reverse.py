import asyncio
from services.google_reverse_image import GoogleReverseImageSearcher

async def test_google_search():
    # Path to a test image (replace with your own image path)
    test_image_path = "test_image.jpg"
    
    try:
        with open(test_image_path, 'rb') as f:
            image_data = f.read()
            
        async with GoogleReverseImageSearcher(headless=False) as searcher:
            results = await searcher.search_by_upload(image_data, test_image_path)
            
        print("\n=== Search Results ===")
        print(f"Status: {results['status']}")
        print(f"Found {len(results.get('results', []))} results")
        
        for i, result in enumerate(results.get('results', [])[:5], 1):
            print(f"\nResult {i}:")
            print(f"Title: {result.get('title', 'N/A')}")
            print(f"URL: {result.get('url', 'N/A')}")
            print(f"Thumbnail: {result.get('thumbnail', 'N/A')[:100]}...")
            
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_google_search())
