from bs4 import BeautifulSoup
from playwright.async_api import async_playwright
import os
import requests
import tempfile
from pathlib import Path
from urllib.parse import urlparse, urljoin

from .iou_eval import IouEvaluate

from supabase import create_client, Client
from storage3.types import CreateSignedUploadUrlOptions

from config.settings import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_MEDIA_BUCKET
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

class CrowdmarkProcessor:
    
    def __init__(self, CM_url, file_save_path):
        self.CM_url = CM_url
        self.file_save_path = file_save_path

    @staticmethod
    def _extract_field(payload, field: str):
        if isinstance(payload, dict):
            direct = payload.get(field)
            if direct:
                return direct
            nested = payload.get("data")
            if isinstance(nested, dict):
                return nested.get(field)
            return None
        return getattr(payload, field, None)

    def upload_to_bucket(url: str, session: requests.Session, idx: int = 1):
        if not url:
            return None
        
        with session.get(url, stream=True, timeout=30) as r:
            r.raise_for_status()

            content_type = (r.headers.get("content-type") or "").lower()
            chunks = r.iter_content(chunk_size=65536)
            first_chunk = next(chunks, b"")

            # JPEG checks: header content-type OR JPEG magic bytes
            is_jpeg = ("image/jpeg" in content_type or "image/jpg" in content_type
                    or first_chunk.startswith(b"\xff\xd8\xff"))
            if not is_jpeg:
                return None
            
            name = os.path.basename(urlparse(url).path) or f"image_{idx}"
            if not name.lower().endswith((".jpg", ".jpeg")):
                name += ".jpg"


            
            with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
                tmp.write(first_chunk)
                for chunk in chunks:
                    if chunk:
                        tmp.write(chunk)
                temp_path = tmp.name

                import cv2
                image = cv2.imread(temp_path)
                if image is None:
                    os.remove(temp_path)
                    return None

                model_path = Path(__file__).with_name("best.pt")
                try:
                    processed_image = IouEvaluate.add_bounding_box(
                        temp_path, model_path, show_window=False
                    )[0]
                except Exception:
                    os.remove(temp_path)
                    return None
                cv2.imwrite(temp_path, processed_image)

                #print(temp_path)
                upload = supabase.storage.from_(SUPABASE_MEDIA_BUCKET).upload(
                                                      file=temp_path,
                                                      path=name,
                                                      file_options={
                                                        "headers" : { "content-type" : 'image/jpg'},
                                                         "upsert": "true", },
                                                        )

                os.remove(temp_path)
        uploaded_path = CrowdmarkProcessor._extract_field(upload, "path")
        if not uploaded_path:
            raise ValueError("Upload to Supabase did not return a storage path.")
        return uploaded_path
        
    
    def create_signed_upload_url(upload_file_path):
        # Generate signed upload URLs for file upload (valid for 2 hours)
        response = (
            supabase.storage
            .from_(SUPABASE_MEDIA_BUCKET)
            .create_signed_upload_url(
                path=upload_file_path, 
                options=CreateSignedUploadUrlOptions(upsert="true"),
            )
        )
        return response
    
    def upload_to_signed_url(url: str, session: requests.Session, idx: int = 1):
        if not url:
            return None
        with session.get(url, stream=True, timeout=30) as r:
            r.raise_for_status()

            content_type = (r.headers.get("content-type") or "").lower() 
            chunks = r.iter_content(chunk_size=65536)
            first_chunk = next(chunks, b"")

            # JPEG checks: header content-type OR JPEG magic bytes
            is_jpeg = ("image/jpeg" in content_type or "image/jpg" in content_type
                    or first_chunk.startswith(b"\xff\xd8\xff"))
            if not is_jpeg:
                return None
            
            name = os.path.basename(urlparse(url).path) or f"image_{idx}"
            if not name.lower().endswith((".jpg", ".jpeg")):
                name += ".jpg"
            
            with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
                tmp.write(first_chunk)
                for chunk in chunks:
                    if chunk:
                        tmp.write(chunk)
                temp_path = tmp.name
                
                # remove handwriting
                import cv2
                image = cv2.imread(temp_path)
                if image is None:
                    os.remove(temp_path)
                    return None

                model_path = Path(__file__).with_name("best.pt")
                try:
                    processed_image = IouEvaluate.add_bounding_box(
                        temp_path, model_path, show_window=False
                    )[0]
                except Exception:
                    os.remove(temp_path)
                    return None
                cv2.imwrite(temp_path, processed_image)

                signed_upload_url = CrowdmarkProcessor.create_signed_upload_url(name)
                signed_path = CrowdmarkProcessor._extract_field(signed_upload_url, "path")
                signed_token = CrowdmarkProcessor._extract_field(signed_upload_url, "token")
                if not signed_path or not signed_token:
                    raise ValueError("Could not read signed upload URL response from Supabase.")
                
                with open(temp_path, "rb") as f:
                    response = (
                        supabase.storage
                        .from_(SUPABASE_MEDIA_BUCKET)
                        .upload_to_signed_url(
                            path=name,
                            token=signed_token,
                            file=f,
                            file_options={"content-type": "image/jpeg"},
                        )
                    )
                

                os.remove(temp_path)

            uploaded_path = CrowdmarkProcessor._extract_field(response, "path") or signed_path
            if not uploaded_path:
                raise ValueError("Signed upload completed without a storage path.")
            return [uploaded_path, {"path": signed_path, "token": signed_token}]


        
    async def main(self, sign: bool = True):
        PHRASE = "m-aspect-img-wrapper"  # class-name substring to match
        URL = self.CM_url

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                # storage_state="state.json"  # if login is required
            )
            page = await context.new_page()
            await page.goto(URL, wait_until="domcontentloaded", timeout=60000)
            await page.wait_for_load_state("networkidle")
            await page.wait_for_timeout(2000)

            html = await page.content()
            await browser.close()

        soup = BeautifulSoup(html, "html.parser")


        urls = []
        for div in soup.find_all("div"):
            classes = div.get("class", [])
            if any(PHRASE in cls for cls in classes):
                img = div.find("img") if div else None
                src = img.get("src") if img else None
                if isinstance(src, str) and src.strip():
                    urls.append(urljoin(URL, src))

        if not urls:
            raise ValueError("No assessment images were found at the provided Crowdmark URL.")

        with requests.Session() as session:
            if sign:
                uploads = []
                signed_urls = []
                for idx, url in enumerate(urls, start=1):
                    tmp = CrowdmarkProcessor.upload_to_signed_url(url, session, idx=idx)
                    if not tmp:
                        continue
                    uploads.append(tmp[0])

                    signed_url = (
                        f"{SUPABASE_URL}/storage/v1/object/sign/"
                        f"{SUPABASE_MEDIA_BUCKET}/{tmp[1]['path']}?token={tmp[1]['token']}"
                    )
                    signed_urls.append(signed_url)
                if not uploads:
                    raise ValueError(
                        "No valid decodable assessment images were found. "
                        "Use a direct Crowdmark share page with visible image content."
                    )
                return [uploads, signed_urls]

            uploads = []
            for idx, url in enumerate(urls, start=1):
                uploaded_path = CrowdmarkProcessor.upload_to_bucket(url, session, idx=idx)
                if uploaded_path:
                    uploads.append(uploaded_path)
            if not uploads:
                raise ValueError(
                    "No valid decodable assessment images were found. "
                    "Use a direct Crowdmark share page with visible image content."
                )

            return uploads
