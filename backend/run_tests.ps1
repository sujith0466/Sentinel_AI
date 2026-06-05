$endpoints = @(
    "/api/cases/",
    "/api/criminals/",
    "/api/network/graph",
    "/api/risk/top",
    "/api/hotspots/",
    "/api/forecast/dashboard",
    "/api/sociology/dashboard",
    "/api/briefs/",
    "/api/governance/dashboard"
)

$baseUrl = "http://127.0.0.1:5000"

Write-Output "Running API Health Audit..."
$results = @()

foreach ($ep in $endpoints) {
    $sw = [Diagnostics.Stopwatch]::StartNew()
    try {
        $res = Invoke-RestMethod -Uri "$baseUrl$ep" -Method Get
        $sw.Stop()
        $status = "OK"
    } catch {
        $sw.Stop()
        $status = "FAIL: $_"
    }
    $results += [PSCustomObject]@{
        Endpoint = $ep
        TimeMs = $sw.ElapsedMilliseconds
        Status = $status
    }
}

$results | Format-Table -AutoSize

Write-Output "Testing Gemini Copilot..."
$copilotPayload = @{ query = "Show high-risk offenders" } | ConvertTo-Json
$sw = [Diagnostics.Stopwatch]::StartNew()
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/api/intelligence/ask" -Method Post -Body $copilotPayload -ContentType "application/json"
    $sw.Stop()
    Write-Output "Copilot Response Time: $($sw.ElapsedMilliseconds)ms"
    Write-Output "Copilot Confidence: $($res.confidence)"
    Write-Output "Mock Mode Triggered: $($res.answer -match 'MOCK MODE')"
} catch {
    Write-Error "Copilot failed: $_"
}

Write-Output "Testing Investigation Room..."
$investigationPayload = @{ entity_type = "Case"; entity_id = "FIR-BULK-23" } | ConvertTo-Json
$sw = [Diagnostics.Stopwatch]::StartNew()
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/api/investigation/analyze" -Method Post -Body $investigationPayload -ContentType "application/json"
    $sw.Stop()
    Write-Output "Investigation Response Time: $($sw.ElapsedMilliseconds)ms"
    Write-Output "Investigation Summary Exists: $($res.summary -ne $null)"
} catch {
    Write-Output "Investigation missing or failed: $_"
}

Write-Output "Testing Brief Generation..."
$briefPayload = @{ entity_type = "Case"; entity_id = "FIR-BULK-23" } | ConvertTo-Json
$sw = [Diagnostics.Stopwatch]::StartNew()
try {
    $res = Invoke-RestMethod -Uri "$baseUrl/api/briefs/generate" -Method Post -Body $briefPayload -ContentType "application/json"
    $sw.Stop()
    Write-Output "Brief Generation Response Time: $($sw.ElapsedMilliseconds)ms"
    Write-Output "Brief PDF Size Bytes: $($res.pdf_base64.Length)"
} catch {
    Write-Output "Brief Generation failed: $_"
}
