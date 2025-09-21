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


def safe_get_data_from_label(soup: BeautifulSoup, label_text: str) -> str:
    """
    Safely extract data from label elements with proper None checking.
    """
    try:
        header_label = soup.find("label", string=label_text)
        if header_label:
            next_sibling = header_label.find_next_sibling("label")
            if next_sibling and next_sibling.text:
                return next_sibling.text.strip()
        return "Not Found"
    except Exception as e:
        print(f"Error extracting {label_text}: {e}")
        return "Error"


@app.get("/api/verify-income/{barcode_id}")
async def verify_certificate(barcode_id: str):
    """
    Verifies a certificate using its barcode ID.
    This version correctly parses the div/label HTML structure with proper None safety.
    """
    url = f"https://aaplesarkar.mahaonline.gov.in/Views/SearchBarCode/DisplayBarCodeData?deptName=Revenue&serviceId=1251&barCode={barcode_id}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")

        # Check for a key field to confirm the certificate is valid
        status = safe_get_data_from_label(soup, "Status")

        if status != "Not Found" and status != "Error":
            # If status is found, the certificate is valid. Extract all details.
            return {
                "status": status,
                "barcodeId": safe_get_data_from_label(
                    soup, "Barcode NUmber"
                ),  # Note: keeping original typo from source
                "certificateName": safe_get_data_from_label(soup, "Certificate Name"),
                "applicantName": safe_get_data_from_label(soup, "Applicant Name"),
                "designationOfSignatory": safe_get_data_from_label(
                    soup, "Designation Of Signatory"
                ),
                "talukaOfSignatory": safe_get_data_from_label(
                    soup, "Taluka Of Signatory"
                ),
                "districtOfSignatory": safe_get_data_from_label(
                    soup, "District Of Signatory"
                ),
                "dateAppliedOn": safe_get_data_from_label(soup, "Date Applied On"),
            }
        else:
            # If the status field isn't found, the barcode is likely invalid
            raise HTTPException(
                status_code=404, detail="Certificate not found or barcode is invalid."
            )

    except requests.exceptions.Timeout:
        raise HTTPException(
            status_code=408,
            detail="Request Timeout: The verification service is taking too long to respond.",
        )
    except requests.exceptions.ConnectionError:
        raise HTTPException(
            status_code=503,
            detail="Service Unavailable: Could not connect to the Aaple Sarkar website.",
        )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=502,
            detail=f"Bad Gateway: Error communicating with verification service. Details: {str(e)}",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


@app.get("/verify-migration/{barcode_id}")
async def verify_migration_certificate(barcode_id: str):
    """
    Verifies a migration certificate using its barcode ID.
    This version correctly parses the div/label HTML structure with proper None safety.
    """
    url = f"https://aaplesarkar.mahaonline.gov.in/Views/SearchBarCode/DisplayBarCodeData?deptName=MSBTED&serviceId=4411&barCode={barcode_id}"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")

        # Check for a key field to confirm the certificate is valid
        status = safe_get_data_from_label(soup, "Status")

        if status != "Not Found" and status != "Error":
            # If status is found, the certificate is valid. Extract all details.
            return {
                "status": status,
                "barcodeId": safe_get_data_from_label(
                    soup, "Barcode NUmber"
                ),  # Note: keeping original typo from source
                "certificateName": safe_get_data_from_label(soup, "Certificate Name"),
                "applicantName": safe_get_data_from_label(soup, "Applicant Name"),
                "designationOfSignatory": safe_get_data_from_label(
                    soup, "Designation Of Signatory"
                ),
                "talukaOfSignatory": safe_get_data_from_label(
                    soup, "Taluka Of Signatory"
                ),
                "districtOfSignatory": safe_get_data_from_label(
                    soup, "District Of Signatory"
                ),
                "dateAppliedOn": safe_get_data_from_label(soup, "Date Applied On"),
            }
        else:
            # If the status field isn't found, the barcode is likely invalid
            raise HTTPException(
                status_code=404,
                detail="Migration certificate not found or barcode is invalid.",
            )

    except requests.exceptions.Timeout:
        raise HTTPException(
            status_code=408,
            detail="Request Timeout: The verification service is taking too long to respond.",
        )
    except requests.exceptions.ConnectionError:
        raise HTTPException(
            status_code=503,
            detail="Service Unavailable: Could not connect to the Aaple Sarkar website.",
        )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=502,
            detail=f"Bad Gateway: Error communicating with verification service. Details: {str(e)}",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


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


# Optional: Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Certificate Verification API"}


# Optional: Get all available endpoints
@app.get("/endpoints")
def list_endpoints():
    return {
        "endpoints": [
            "/api/verify-income/{barcode_id} - Verify income certificate",
            "/verify-migration/{barcode_id} - Verify migration certificate",
            "/api/hello - GET/POST test endpoints",
            "/api/test - Connection test",
            "/health - Health check",
            "/endpoints - This endpoint list",
        ]
    }
