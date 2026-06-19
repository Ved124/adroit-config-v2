import sys

try:
    import PyPDF2

    def extract_text(pdf_path):
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ''
            for page_num in range(len(reader.pages)):
                text += reader.pages[page_num].extract_text()
            return text

    if __name__ == '__main__':
        pdf_path = sys.argv[1]
        text = extract_text(pdf_path)
        with open('output_pdf.txt', 'w', encoding='utf-8') as out_file:
            out_file.write(text)
        print("Done")
except ImportError:
    print("PyPDF2 not installed. Using fallback.")
    import fitz # PyMuPDF
    def extract_text(pdf_path):
        doc = fitz.open(pdf_path)
        text = ''
        for page in doc:
            text += page.get_text()
        return text
    if __name__ == '__main__':
        pdf_path = sys.argv[1]
        text = extract_text(pdf_path)
        with open('output_pdf.txt', 'w', encoding='utf-8') as out_file:
            out_file.write(text)
        print("Done")
