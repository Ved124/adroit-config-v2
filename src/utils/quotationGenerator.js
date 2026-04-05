export function generateNextQuotationRef(region = "DOM") {
    if (typeof window === 'undefined') return `AE/${region}/MW/01`;

    // 1. Get Date Parts
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const dateCode = `${mm}${dd}`;

    // 3. Define the Storage Key (Specific to THIS DAY)
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

    // 7. Format padding: 1 -> "01", 10 -> "10"
    const seqStr = String(nextSeq).padStart(2, '0');

    // 7. Return Final String
    // Format: AE/DOM/MW/01
    return `AE/${region}/MW/${seqStr}`;
}
