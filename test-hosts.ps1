# Script para testar a API com diferentes hosts

$hosts = @("localhost", "127.0.0.1", "0.0.0.0")

foreach ($hostname in $hosts) {
    Write-Host "=== Testando com $hostname ==="
    
    $registerBody = @{
        nome = "Usuario Teste"
        email = "teste@exemplo.com"
        senha = "123456"
    } | ConvertTo-Json

    try {
        $registerResponse = Invoke-WebRequest -Uri "http://$hostname`:3333/api/usuarios/register" -Method POST -ContentType "application/json" -Body $registerBody -TimeoutSec 5
        Write-Host "Registro OK - Status: $($registerResponse.StatusCode)"
        Write-Host "Resposta: $($registerResponse.Content)"
        break
    }
    catch {
        Write-Host "Erro com $hostname`: $($_.Exception.Message)"
    }
}