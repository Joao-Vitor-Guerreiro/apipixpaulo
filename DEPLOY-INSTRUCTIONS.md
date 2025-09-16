# 🚀 Instruções de Deploy

## ✅ O que está funcionando:
- ✅ Erros de Prisma corrigidos
- ✅ Validações implementadas
- ✅ Lógica 7x3 funcionando
- ✅ Sistema estável

## 🔧 Configuração para Produção:

### 1. **Variáveis de Ambiente**
Crie um arquivo `.env` no servidor com suas credenciais:

```env
# Configurações do Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"

# Credenciais BlackCat Pagamentos
BLACKCAT_PUBLIC_KEY="sua_public_key_aqui"
BLACKCAT_SECRET_KEY="sua_secret_key_aqui"
BLACKCAT_WEBHOOK_SECRET="sua_webhook_secret_aqui"

# Credenciais AllowPayments
ALLOWPAY_SECRET_KEY="sua_secret_key_aqui"
ALLOWPAY_COMPANY_ID="seu_company_id_aqui"
ALLOWPAY_WEBHOOK_SECRET="YOUR_WEBHOOK_SECRET"
```

### 2. **Comandos de Deploy**
```bash
# 1. Fazer commit das alterações
git add .
git commit -m "fix: corrige erros de validação no allowpayments controller"

# 2. Fazer push para o repositório
git push origin main

# 3. No servidor, fazer pull
git pull origin main

# 4. Instalar dependências
npm install

# 5. Configurar banco de dados
npx prisma migrate deploy

# 6. Iniciar servidor
npm run dev
```

### 3. **Verificação**
Após o deploy, teste o endpoint:
```bash
curl -X POST http://seu-servidor:3434/allowpayments \
  -H "Content-Type: application/json" \
  -d '{
    "credentials": {
      "token": "test-token",
      "name": "Cliente Teste"
    },
    "amount": 50.00,
    "product": {
      "title": "Produto Teste"
    },
    "customer": {
      "phone": "11999999999",
      "name": "João Silva",
      "email": "joao@teste.com",
      "document": {
        "type": "CPF",
        "number": "12345678901"
      }
    }
  }'
```

## 🎯 **Resumo:**
- ✅ **Código pronto** - Todos os erros corrigidos
- ✅ **Credenciais testadas** - Funcionando localmente
- ✅ **Sistema estável** - Pronto para produção
- ⚠️ **Lembre-se** - Configurar variáveis de ambiente no servidor

## 🔒 **Segurança:**
- ✅ Arquivo `.env` está no `.gitignore`
- ✅ Credenciais não vão para o Git
- ✅ Sistema seguro para produção
