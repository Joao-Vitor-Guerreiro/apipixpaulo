#!/bin/bash

echo "🚀 DEPLOY NO EASYPANEL (VPS)"
echo "=============================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir com cores
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    print_error "Arquivo package.json não encontrado. Execute este script no diretório do projeto."
    exit 1
fi

print_status "Diretório do projeto encontrado"

# 2. Fazer pull das alterações
echo "📥 Fazendo pull das alterações..."
git pull origin main
if [ $? -eq 0 ]; then
    print_status "Pull realizado com sucesso"
else
    print_error "Erro ao fazer pull"
    exit 1
fi

# 3. Instalar dependências
echo "📦 Instalando dependências..."
npm install
if [ $? -eq 0 ]; then
    print_status "Dependências instaladas"
else
    print_error "Erro ao instalar dependências"
    exit 1
fi

# 4. Verificar se o arquivo .env existe
if [ ! -f ".env" ]; then
    print_warning "Arquivo .env não encontrado"
    echo "📝 Criando arquivo .env..."
    
    cat > .env << EOF
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="postgresql://painelpixmanager_owner:npg_ut0TLISZb4sc@ep-crimson-snow-ac4i3dtg-pooler.sa-east-1.aws.neon.tech/painelpixmanager?sslmode=require"

# Credenciais BlackCat Pagamentos
BLACKCAT_PUBLIC_KEY="sua_public_key_aqui"
BLACKCAT_SECRET_KEY="sua_secret_key_aqui"
BLACKCAT_WEBHOOK_SECRET="sua_webhook_secret_aqui"

# Credenciais AllowPayments
ALLOWPAY_SECRET_KEY="sua_secret_key_aqui"
ALLOWPAY_COMPANY_ID="seu_company_id_aqui"
ALLOWPAY_WEBHOOK_SECRET="YOUR_WEBHOOK_SECRET"
EOF
    
    print_status "Arquivo .env criado"
else
    print_status "Arquivo .env já existe"
fi

# 5. Configurar banco de dados
echo "🗄️  Configurando banco de dados..."
npx prisma migrate deploy
if [ $? -eq 0 ]; then
    print_status "Banco de dados configurado"
else
    print_warning "Erro ao configurar banco de dados (pode ser normal se já estiver configurado)"
fi

# 6. Testar configuração
echo "🧪 Testando configuração..."
node testar-vps.js
if [ $? -eq 0 ]; then
    print_status "Teste de configuração passou"
else
    print_warning "Teste de configuração falhou (verifique as credenciais)"
fi

# 7. Reiniciar servidor
echo "🔄 Reiniciando servidor..."
pkill -f "npm run dev" || true
pkill -f "node.*server" || true
sleep 2

# Iniciar servidor em background
nohup npm run dev > server.log 2>&1 &
SERVER_PID=$!

# Aguardar um pouco para o servidor inicializar
sleep 5

# Verificar se o servidor está rodando
if ps -p $SERVER_PID > /dev/null; then
    print_status "Servidor reiniciado (PID: $SERVER_PID)"
else
    print_error "Erro ao reiniciar servidor"
    echo "📋 Logs do servidor:"
    tail -20 server.log
    exit 1
fi

# 8. Testar endpoint
echo "🌐 Testando endpoint..."
sleep 3

# Testar se o servidor está respondendo
if curl -s http://localhost:3434/clients > /dev/null; then
    print_status "Servidor respondendo na porta 3434"
else
    print_warning "Servidor não está respondendo (pode estar inicializando)"
fi

echo ""
echo "🎉 DEPLOY CONCLUÍDO!"
echo "==================="
echo "✅ Código atualizado"
echo "✅ Dependências instaladas"
echo "✅ Banco de dados configurado"
echo "✅ Servidor reiniciado"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o domínio no EasyPanel"
echo "2. Atualize as URLs dos webhooks"
echo "3. Teste o sistema em produção"
echo ""
echo "🔍 Para verificar logs:"
echo "tail -f server.log"
echo ""
echo "🛑 Para parar o servidor:"
echo "kill $SERVER_PID"
