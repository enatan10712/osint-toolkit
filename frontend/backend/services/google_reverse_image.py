import os
import asyncio
import tempfile
from typing import Dict, List, Optional
from datetime import datetime
import hashlib
import logging
from fastapi import UploadFile, HTTPException
from playwright.async_api import async_playwright

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GoogleReverseImageSearcher:
    def __init__(self, headless: bool = True):
        self.headless = headless
        self.browser = None
        self.context = None
        self.page = None

    async def __aenter__(self):
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(headless=self.headless)
        self.context = await self.browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        )
        self.page = await self.context.new_page()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.browser:
            await self.browser.close()
        await self.playwright.stop()

    async def search_by_upload(self, image_data: bytes, filename: str) -> Dict:
        """Perform reverse image search by uploading an image"""
        try:
            # Create a temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(filename)[1]) as tmp_file:
                tmp_file.write(image_data)
                tmp_path = tmp_file.name

            try:
                # Navigate to Google Images
                await self.page.goto('https://images.google.com/', wait_until='networkidle')
                
                # Click the camera icon to open the upload dialog
                await self.page.click('div[aria-label="Search by image"]')
                await asyncio.sleep(1)  # Wait for the dialog to open
                
                # Handle file upload
                file_input = await self.page.query_selector('input[type="file"]')
                if not file_input:
                    raise Exception("File input not found")
                
                await file_input.set_input_files(tmp_path)
                
                # Wait for results to load
                await self.page.wait_for_selector('div[aria-label="Search Results"]', timeout=10000)
                
                # Extract results
                results = []
                result_elements = await self.page.query_selector_all('div[data-ved]')
                
                for element in result_elements[:10]:  # Limit to top 10 results
                    try:
                        title = await element.get_attribute('title') or "No title"
                        url = await element.get_attribute('href') or "#"
                        if not url.startswith('http'):
                            url = f"https://www.google.com{url}"
                        
                        # Try to get image URL
                        img = await element.query_selector('img')
                        thumbnail = await img.get_attribute('src') if img else ""
                        
                        results.append({
                            'title': title,
                            'url': url,
                            'thumbnail': thumbnail
                        })
                    except Exception as e:
                        logger.warning(f"Error parsing result: {str(e)}")
                        continue
                
                return {
                    'status': 'success',
                    'search_type': 'upload',
                    'filename': filename,
                    'file_size': len(image_data),
                    'image_hash': hashlib.md5(image_data).hexdigest(),
                    'results': results,
                    'timestamp': datetime.utcnow().isoformat()
                }
                
            finally:
                # Clean up the temporary file
                try:
                    os.unlink(tmp_path)
                except:
                    pass
                    
        except Exception as e:
            logger.error(f"Reverse image search failed: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Reverse image search failed: {str(e)}"
            )

async def reverse_image_search(image_data: bytes, filename: str) -> Dict:
    """Main function to perform reverse image search"""
    async with GoogleReverseImageSearcher(headless=True) as searcher:
        return await searcher.search_by_upload(image_data, filename)
