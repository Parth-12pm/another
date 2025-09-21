from fastapi import FastAPI, HTTPException
import requests
from bs4 import BeautifulSoup
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://another-git-master-parth-12pms-projects.vercel.app/",
        "http://localhost:3000",
    ],  # In production, replace with your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic model for POST requests
class Message(BaseModel):
    name: str
    message: str


@app.get("/api/verify-income/{barcode_id}")
async def verify_certificate(barcode_id: str):
    """
    Verifies a certificate using its barcode ID.
    This version correctly parses the div/label HTML structure.
    """
    url = f"https://aaplesarkar.mahaonline.gov.in/Views/SearchBarCode/DisplayBarCodeData?deptName=Revenue&serviceId=1251&barCode={barcode_id}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")

        # --- Corrected Parsing Logic ---
        # Helper function to find a label by its text and get the text of the *next* label sibling.
        def get_data_from_label(label_text):
            header_label = soup.find("label", string=label_text)
            if header_label and header_label.find_next_sibling("label"):
                return header_label.find_next_sibling("label").text.strip()
            return "Not Found"

        # Check for a key field to confirm the certificate is valid.
        status = get_data_from_label("Status")

        if status != "Not Found":
            # If status is found, the certificate is valid. Extract all details.
            return {
                "status": status,
                "barcodeId": get_data_from_label("Barcode NUmber"),
                "certificateName": get_data_from_label("Certificate Name"),
                "applicantName": get_data_from_label("Applicant Name"),
                "designationOfSignatory": get_data_from_label(
                    "Designation Of Signatory"
                ),
                "talukaOfSignatory": get_data_from_label("Taluka Of Signatory"),
                "districtOfSignatory": get_data_from_label("District Of Signatory"),
                "dateAppliedOn": get_data_from_label("Date Applied On"),
            }
        else:
            # If the status field isn't found, the barcode is likely invalid.
            raise HTTPException(
                status_code=404, detail="Certificate not found or barcode is invalid."
            )

    except requests.exceptions.RequestException:
        raise HTTPException(
            status_code=503,
            detail="Service Unavailable: Could not connect to the Aaple Sarkar website.",
        )


@app.get("/verify-migration/{barcode_id}")
async def verify_migration_certificate(barcode_id: str):
    """
    Verifies a certificate using its barcode ID.
    This version correctly parses the div/label HTML structure.
    """
    url = f"https://aaplesarkar.mahaonline.gov.in/Views/SearchBarCode/DisplayBarCodeData?deptName=MSBTED&serviceId=4411&barCode={barcode_id}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")

        # --- Corrected Parsing Logic ---
        # Helper function to find a label by its text and get the text of the *next* label sibling.
        def get_data_from_label(label_text):
            header_label = soup.find("label", string=label_text)
            if header_label and header_label.find_next_sibling("label"):
                return header_label.find_next_sibling("label").text.strip()
            return "Not Found"

        # Check for a key field to confirm the certificate is valid.
        status = get_data_from_label("Status")

        if status != "Not Found":
            # If status is found, the certificate is valid. Extract all details.
            return {
                "status": status,
                "barcodeId": get_data_from_label("Barcode NUmber"),
                "certificateName": get_data_from_label("Certificate Name"),
                "applicantName": get_data_from_label("Applicant Name"),
                "designationOfSignatory": get_data_from_label(
                    "Designation Of Signatory"
                ),
                "talukaOfSignatory": get_data_from_label("Taluka Of Signatory"),
                "districtOfSignatory": get_data_from_label("District Of Signatory"),
                "dateAppliedOn": get_data_from_label("Date Applied On"),
            }
        else:
            # If the status field isn't found, the barcode is likely invalid.
            raise HTTPException(
                status_code=404, detail="Certificate not found or barcode is invalid."
            )

    except requests.exceptions.RequestException:
        raise HTTPException(
            status_code=503,
            detail="Service Unavailable: Could not connect to the Aaple Sarkar website.",
        )


@app.get("/api")
def read_root():
    return {"message": "Hello from FastAPI!", "status": "success"}


@app.get("/api/hello")
def get_hello():
    return {"greeting": "Hello World!", "method": "GET", "timestamp": "2025-09-08"}


@app.post("/api/hello")
def post_hello(data: Message):
    return {
        "message": f"Hello {data.name}! You said: {data.message}",
        "method": "POST",
        "received_data": {"name": data.name, "message": data.message},
    }


@app.get("/api/test")
def test_connection():
    return {
        "status": "connected",
        "message": "FastAPI is working!",
        "data": ["item1", "item2", "item3"],
    }
