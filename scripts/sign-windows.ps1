param(
  [Parameter(Mandatory = $true)]
  [string]$FilePath
)

$mode = if ($env:ATIGA_WINDOWS_SIGNING) { $env:ATIGA_WINDOWS_SIGNING } else { 'optional' }
if ($mode -ne 'required' -and (
    [string]::IsNullOrWhiteSpace($env:WINDOWS_SIGNING_CERTIFICATE_PATH) -or
    -not (Test-Path -LiteralPath $env:WINDOWS_SIGNING_CERTIFICATE_PATH)
  )) {
  Write-Host "Windows signing dilewati untuk build $FilePath."
  exit 0
}

if ([string]::IsNullOrWhiteSpace($env:WINDOWS_SIGNING_CERTIFICATE_PATH)) {
  throw 'WINDOWS_SIGNING_CERTIFICATE_PATH belum diatur.'
}
if (-not (Test-Path -LiteralPath $env:WINDOWS_SIGNING_CERTIFICATE_PATH)) {
  throw "Sertifikat signing tidak ditemukan: $env:WINDOWS_SIGNING_CERTIFICATE_PATH"
}
if ([string]::IsNullOrWhiteSpace($env:WINDOWS_SIGNING_CERTIFICATE_PASSWORD)) {
  throw 'WINDOWS_SIGNING_CERTIFICATE_PASSWORD belum diatur.'
}

$signToolPath = (Get-Command signtool.exe -ErrorAction SilentlyContinue).Source
if (-not $signToolPath) {
  $signToolPath = (Get-ChildItem "${env:ProgramFiles(x86)}\Windows Kits\10\bin\*\x64\signtool.exe" -ErrorAction SilentlyContinue |
    Sort-Object FullName -Descending |
    Select-Object -First 1).FullName
}
if (-not $signToolPath) { throw 'signtool.exe tidak ditemukan pada runner Windows.' }

$timestampUrl = if ($env:WINDOWS_SIGNING_TIMESTAMP_URL) { $env:WINDOWS_SIGNING_TIMESTAMP_URL } else { 'http://timestamp.digicert.com' }
& $signToolPath sign /fd SHA256 /f $env:WINDOWS_SIGNING_CERTIFICATE_PATH /p $env:WINDOWS_SIGNING_CERTIFICATE_PASSWORD /tr $timestampUrl /td SHA256 $FilePath
if ($LASTEXITCODE -ne 0) { throw "signtool gagal untuk $FilePath dengan exit code $LASTEXITCODE" }
