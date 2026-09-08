$ErrorActionPreference = 'Stop'
$source = Join-Path $PSScriptRoot '../draft/flow.html'
$hostName = 'itbird@100.109.73.121'
$target = '/data/ZhongData/Data_PersonalFiles/400_Code/450_OntologyV2/static/flow.html'
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$staged = "$target.upload-$stamp"
$hash = (Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash.ToLowerInvariant()
& scp -o BatchMode=yes -o ConnectTimeout=5 $source "${hostName}:$staged"
if ($LASTEXITCODE -ne 0) { throw 'NUC upload failed' }
& ssh -o BatchMode=yes -o ConnectTimeout=5 $hostName "set -eu; echo '$hash  $staged' | sha256sum -c -; cp -p '$target' '$target.bak-$stamp'; chmod 644 '$staged'; mv '$staged' '$target'"
if ($LASTEXITCODE -ne 0) { throw 'NUC backup or replacement failed' }
$response = Invoke-WebRequest "http://100.109.73.121:8501/app/static/flow.html?release=$stamp" -UseBasicParsing -TimeoutSec 20
$expected = [IO.File]::ReadAllText((Resolve-Path $source))
if ($response.Content -cne $expected) { throw 'NUC HTTP content differs from published source' }
Write-Output "Verified NUC HTTP content matches draft/flow.html (SHA256 $hash). Backup: $target.bak-$stamp"
