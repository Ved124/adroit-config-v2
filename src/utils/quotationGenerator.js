
export function generateNextQuotationRef() {
    if (typeof window === 'undefined') return ""; // Safety for SSR

    const now = new Date();
    const yearFull = now.getFullYear();
    const yearShort = String(yearFull).slice(-2); // "26"
    const month = String(now.getMonth() + 1).padStart(2, '0'); // "02"
    const day = String(now.getDate()).padStart(2, '0'); // "20"

    // Create a storage key specific to TODAY. 
    // This resets the count to 001 every new day.
    const storageKey = `quote_sequence_${yearFull}${month}${day}`;

    // 1. Get current sequence from browser storage
    let currentSeq = localStorage.getItem(storageKey);

    // 2. Increment
    let nextSeq = 1;
    if (currentSeq) {
        nextSeq = parseInt(currentSeq, 10) + 1;
    }

    // 3. Save back to storage
    localStorage.setItem(storageKey, nextSeq.toString());

    // 4. Pad with zeros (e.g., 1 -> "001")
    const seqPadded = String(nextSeq).padStart(3, '0');

    // 5. Construct Final Ref: AET/DOM/YY/MMDD/SEQ
    // Example: AET/DOM/26/0220/001
    return `AET/DOM/${yearShort}/${month}${day}/${seqPadded}`;
}
