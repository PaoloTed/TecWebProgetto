$sourceDir = "c:\Users\Paolo\Desktop\Universita\Terzo Anno\TecWeb\Progetto\TecWebProgetto"
$tempDir = "$sourceDir\temp_consegna_streetcats"

Write-Host "Creazione cartella temporanea..."
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

Write-Host "Copia dei file (questo richiederà qualche secondo)..."
Copy-Item -Path "$sourceDir\streetcats" -Destination $tempDir -Recurse
Copy-Item -Path "$sourceDir\documento_consegna.txt" -Destination $tempDir

Write-Host "Pulizia delle cartelle ignorate (node_modules, .angular, ecc)..."
Remove-Item -Path "$tempDir\streetcats\streetcats-frontend\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$tempDir\streetcats\streetcats-backend\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "$tempDir\streetcats\streetcats-frontend\.angular" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Creazione archivio ZIP..."
$zipPath = "$sourceDir\consegna_Tedesco_Paolo_N86004408.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -Force

Write-Host "Pulizia file temporanei..."
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "Finito! L'archivio è pronto in: $zipPath"
