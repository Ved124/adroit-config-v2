$file = "pages\summary.jsx"
$c = Get-Content $file -Raw -Encoding UTF8

# Verify initial state
$checkBefore = $c.IndexOf("if (hauloffIdx")
Write-Host "hauloffIdx block found at: $checkBefore"

# 1. Skip the haul-off/collapsing merge for 3-layer/5-layer
# Use regex to match the entire if block
$oldPattern = [regex]::Escape("  if (hauloffIdx !== -1 && collapsingIdx !== -1) {`r`n    const cfItem = preCombineScope[collapsingIdx];`r`n    const hoItem = preCombineScope[hauloffIdx];`r`n`r`n    preCombineScope[hauloffIdx] = {`r`n      ...hoItem,`r`n      name: `"Haul-Off and Collapsing Frame`",`r`n      shortDesc: ``${cfItem.shortDesc}\n${hoItem.shortDesc}``,`r`n      scopeDesc: ``${cfItem.scopeDesc || cfItem.shortDesc}\n${hoItem.scopeDesc || hoItem.shortDesc}``,`r`n      techDesc: { ...cfItem.techDesc, ...hoItem.techDesc }`r`n    };`r`n    preCombineScope.splice(collapsingIdx, 1);`r`n  }")

# Check if old pattern matches
if ($c -match [regex]::Escape("if (hauloffIdx !== -1 && collapsingIdx !== -1)")) {
    Write-Host "Old merge block found"
} else {
    Write-Host "Old merge block NOT found"
}

# Try a simpler search
$simpleSrc = "if (hauloffIdx !== -1 && collapsingIdx !== -1)"
if ($c.Contains($simpleSrc)) {
    Write-Host "Simple merge check FOUND"
} else {
    Write-Host "Simple merge check NOT FOUND"
}

# Check if we have ampersand issue
$simpleSrc2 = "if (hauloffIdx !== -1 &&"
if ($c.Contains($simpleSrc2)) {
    Write-Host "Ampersand version FOUND"
}

# Hex dump around idx 33081
$bytes = [System.Text.Encoding]::UTF8.GetBytes($c)
$slice = $bytes[33081..33150]
$slice | ForEach-Object { "{0:X2}" -f $_ } | Write-Host
