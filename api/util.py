from PyPDF2 import PdfReader


def pdf_read():
    reader = PdfReader("doc.pdf")
    num_of_pages = len(reader.pages)

    full_text = ""

    for page_num in range(num_of_pages):
        page = reader.pages[page_num]
        text = page.extract_text()
        if text:
            full_text += text + "\n"

    lines = [line.strip() for line in full_text.splitlines()]

    clean_text = " ".join(filter(None, lines))

    return clean_text
