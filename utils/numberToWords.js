export function numberToWords(n) {
  if (n < 0) return "Minus " + numberToWords(-n);
  if (n === 0) return "Zero";

  const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function convertBelow1000(num) {
    let str = "";
    if (num >= 100) {
      str += units[Math.floor(num / 100)] + " Hundred ";
      num %= 100;
    }
    if (num >= 20) {
      str += tens[Math.floor(num / 10)] + " ";
      num %= 10;
    }
    if (num >= 10) {
      str += teens[num - 10] + " ";
      num = 0;
    }
    if (num > 0) {
      str += units[num] + " ";
    }
    return str;
  }

  // Indian Numbering System for Adroit Quotation
  // N < 1000
  // N < 1,00,000 (Lakh)
  // N < 1,00,00,000 (Crore)

  let str = "";
  const floor = Math.floor;

  const crore = floor(n / 10000000);
  n %= 10000000;

  const lakh = floor(n / 100000);
  n %= 100000;

  const thousand = floor(n / 1000);
  n %= 1000;

  if (crore > 0) {
    str += convertBelow1000(crore) + "Crore ";
  }
  if (lakh > 0) {
    str += convertBelow1000(lakh) + "Lakh ";
  }
  if (thousand > 0) {
    str += convertBelow1000(thousand) + "Thousand ";
  }
  if (n > 0) {
    str += convertBelow1000(n);
  }

  return str.trim();
}