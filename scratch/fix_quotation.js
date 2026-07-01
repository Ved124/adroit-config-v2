const fs = require('fs');
const file = 'src/components/quotation/AdroitQuotation.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace {isMixer ? MODEL : \ : MODEL : \_\}
content = content.replace(/\{isMixer \? MODEL : \\\ : MODEL : \\\_\\\\}/g, 
    "{isMixer ? MODEL :  : MODEL : }");

// Replace {isMixer ? MODEL : \ : MODEL : \_\} in case there's any other variant
fs.writeFileSync(file, content);
