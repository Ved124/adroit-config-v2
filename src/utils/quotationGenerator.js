export function generateNextQuotationRef() {
    if (typeof window === 'undefined') return "AET/DOM/DRAFT"; // Server-side safety

    // 1. Get Date Parts
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2); // e.g., "26"
    const mm = String(now.getMonth() + 1).padStart(2, '0'); // e.g., "02"
    const dd = String(now.getDate()).padStart(2, '0'); // e.g., "20"
    const dateCode = `${mm}${dd}`;

    // 3. Define the Storage Key (Specific to THIS DAY)
    // If the date changes, the key changes, so the counter resets to 001 automatically.
    const storageKey = `seq_${now.getFullYear()}${dateCode}`;

    // 4. Get Current Sequence
    const storedSeq = localStorage.getItem(storageKey);

    // 5. Calculate Next Sequence
    let nextSeq = 1;
    if (storedSeq) {
        nextSeq = parseInt(storedSeq, 10) + 1;
    }

    // 6. Save back to browser memory immediately
    localStorage.setItem(storageKey, nextSeq.toString());

    // 7. Format padding: 1 -> "001", 10 -> "010"
    const seqStr = String(nextSeq).padStart(3, '0');

    // 7. Return Final String
    // Format: AET/DOM/26/0220/001
    return `AET/DOM/${yy}/${dateCode}/${seqStr}`;
}
