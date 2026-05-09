import pdfplumber
import io
import sys

# Set output to utf-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

pdf_path = r"c:\Users\vedmi\Downloads\ae-configurator-master\sample pdf\Proposal for 3 layer, 556555 mm,1870 mm.pdf"
output_path = r"c:\Users\vedmi\Downloads\ae-configurator-master\scratch\pdf_content.txt"

try:
    with pdfplumber.open(pdf_path) as pdf:
        with open(output_path, "w", encoding="utf-8") as f:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    f.write(text + "\n")
        print(f"Content saved to {output_path}")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
