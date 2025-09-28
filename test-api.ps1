# Script para testar a API

# Teste 1: Registro de usuário
Write-Host "=== Testando Registro ==="
$registerBody = @{
    nome = "Usuario Teste"
    email = "teste@exemplo.com"
    senha = "123456"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-WebRequest -Uri "http://localhost:3333/api/usuarios/register" -Method POST -ContentType "application/json" -Body $registerBody
    Write-Host "Status: $($registerResponse.StatusCode)"
    Write-Host "Resposta: $($registerResponse.Content)"
}
catch {
    Write-Host "Erro no registro: $($_.Exception.Message)"
}

# Teste 2: Login
Write-Host "`n=== Testando Login ==="
$loginBody = @{
    email = "teste@exemplo.com"
    senha = "123456"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "http://localhost:3333/api/usuarios/login" -Method POST -ContentType "application/json" -Body $loginBody -SessionVariable session
    Write-Host "Status: $($loginResponse.StatusCode)"
    Write-Host "Resposta: $($loginResponse.Content)"
    
    # Teste 3: Perfil do usuário (com cookie de sessão)
    Write-Host "`n=== Testando Perfil ==="
    $perfilResponse = Invoke-WebRequest -Uri "http://localhost:3333/api/usuarios/perfil" -Method GET -WebSession $session
    Write-Host "Status: $($perfilResponse.StatusCode)"
    Write-Host "Resposta: $($perfilResponse.Content)"
}
catch {
    Write-Host "Erro: $($_.Exception.Message)"
}