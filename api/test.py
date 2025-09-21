import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI, HTTPException

# Create a FastAPI app instance
app = FastAPI(
    title="Aaple Sarkar Certificate Verifier",
    description="An API to verify certificates from the Aaple Sarkar portal by scraping the result page.",
    version="1.0.0",
)


