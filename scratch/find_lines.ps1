$file = "pages\summary.jsx"
$lines = Get-Content $file -Encoding UTF8

# Find the hauloffIdx merge block and getSortedScope function by searching line content
$mergeStart = -1
$mergeEnd = -1
$fnStart = -1
$fnEnd = -1

for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    if ($mergeStart -eq -1 -and $line.TrimEnd() -eq "  if (hauloffIdx !== -1 && collapsingIdx !== -1) {") {
        $mergeStart = $i
    }
    if ($mergeStart -ne -1 -and $mergeEnd -eq -1 -and $i -gt $mergeStart -and $line.TrimEnd() -eq "  }") {
        $mergeEnd = $i
    }
    if ($line.TrimEnd() -eq "  // Refine SORT_ORDER index logic to put panel/control at the absolute bottom") {
        $fnStart = $i
    }
    if ($fnStart -ne -1 -and $fnEnd -eq -1 -and $i -gt $fnStart + 2 -and $line.TrimEnd() -eq "  }") {
        $fnEnd = $i
    }
}

Write-Host "Merge block: lines $mergeStart to $mergeEnd"
Write-Host "Function: lines $fnStart to $fnEnd"
Write-Host "Total lines: $($lines.Count)"
