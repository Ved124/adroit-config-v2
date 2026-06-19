import zipfile
import xml.etree.ElementTree as ET
import sys
import io

# Force UTF-8 for Windows console
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def read_docx(file_path):
    try:
        with zipfile.ZipFile(file_path, 'r') as docx:
            content = docx.read('word/document.xml')
            tree = ET.fromstring(content)
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            paragraphs = []
            for p in tree.findall('.//w:p', namespaces=ns):
                texts = [node.text for node in p.findall('.//w:t', namespaces=ns) if node.text]
                if texts:
                    paragraphs.append(''.join(texts))
                    
            return '\n'.join(paragraphs)
    except Exception as e:
        return f"Error reading {file_path}: {e}"

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python read_docx.py <file.docx>")
        sys.exit(1)
        
    text = read_docx(sys.argv[1])
    with open('output.txt', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Wrote output to output.txt")
