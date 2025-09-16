# 🚀 Configuração no EasyPanel (VPS)

## 📋 Pré-requisitos
- ✅ Código corrigido e funcionando
- ✅ Credenciais testadas localmente
- ✅ Arquivo .env configurado

## 🔧 Configuração no EasyPanel

### 1. **Deploy do Código**
```bash
# No seu computador local
git add .
git commit -m "fix: corrige erros e configura credenciais"
git push origin main

# No EasyPanel, fazer pull
git pull origin main
```

### 2. **Configurar Variáveis de Ambiente no EasyPanel**

#### Opção A: Via Interface do EasyPanel
1. Acesse seu projeto no EasyPanel
2. Vá em **Settings** → **Environment Variables**
3. Adicione as seguintes variáveis:

```env
DATABASE_URL=postgresql://painelpixmanager_owner:npg_ut0TLISZb4sc@ep-crimson-snow-ac4i3dtg-pooler.sa-east-1.aws.neon.tech/painelpixmanager?sslmode=require

BLACKCAT_PUBLIC_KEY=sua_public_key_aqui
BLACKCAT_SECRET_KEY=sua_secret_key_aqui
BLACKCAT_WEBHOOK_SECRET=sua_webhook_secret_aqui

ALLOWPAY_SECRET_KEY=sua_secret_key_aqui
ALLOWPAY_COMPANY_ID=93b610dd-202b-498f-9007-57195f5eb67b
ALLOWPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET
```

#### Opção B: Via Terminal do EasyPanel
```bash
# Conectar via SSH no EasyPanel
# Criar arquivo .env
nano .env

# Adicionar o conteúdo:
DATABASE_URL="postgresql://painelpixmanager_owner:npg_ut0TLISZb4sc@ep-crimson-snow-ac4i3dtg-pooler.sa-east-1.aws.neon.tech/painelpixmanager?sslmode=require"

BLACKCAT_PUBLIC_KEY="sua_public_key_aqui"
BLACKCAT_SECRET_KEY="sua_secret_key_aqui"
BLACKCAT_WEBHOOK_SECRET="sua_webhook_secret_aqui"

ALLOWPAY_SECRET_KEY="sua_secret_key_aqui"
ALLOWPAY_COMPANY_ID="seu_company_id_aqui"
ALLOWPAY_WEBHOOK_SECRET="YOUR_WEBHOOK_SECRET"

# Salvar e sair (Ctrl+X, Y, Enter)
```

### 3. **Instalar Dependências**
```bash
# No terminal do EasyPanel
npm install
```

### 4. **Configurar Banco de Dados**
```bash
# Executar migrações do Prisma
npx prisma migrate deploy
```

### 5. **Iniciar o Servidor**
```bash
# Iniciar em produção
npm run dev
# ou
npm start
```

## 🔍 Verificação da Configuração

### 1. **Testar Variáveis de Ambiente**
```bash
# No terminal do EasyPanel
node -e "console.log('BLACKCAT_PUBLIC_KEY:', process.env.BLACKCAT_PUBLIC_KEY)"
node -e "console.log('ALLOWPAY_SECRET_KEY:', process.env.ALLOWPAY_SECRET_KEY)"
```

### 2. **Testar Endpoint**
```bash
# Testar localmente no VPS
curl -X POST http://localhost:3434/allowpayments \
  -H "Content-Type: application/json" \
  -d '{
    "credentials": {
      "token": "test-vps",
      "name": "Cliente Teste VPS"
    },
    "amount": 50.00,
    "product": {
      "title": "Produto Teste VPS"
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

## 🌐 Configuração de Domínio

### 1. **Configurar Proxy Reverso (se necessário)**
No EasyPanel, configure o proxy para a porta 3434:
- **Porta interna**: 3434
- **Domínio**: seu-dominio.com
- **Path**: / (ou /api se quiser)

### 2. **Configurar Webhooks**
Atualize as URLs dos webhooks para apontar para seu domínio:
- **BlackCat Webhook**: `https://seu-dominio.com/webhook-blackcat`
- **AllowPayments Webhook**: `https://seu-dominio.com/webhook-allowpayments`

## 🔒 Segurança

### 1. **Verificar .gitignore**
```bash
# Verificar se .env está no .gitignore
cat .gitignore | grep -E "\.env"
```

### 2. **Permissões do Arquivo .env**
```bash
# Definir permissões corretas
chmod 600 .env
```

## 🚨 Troubleshooting

### Problema: Erro 401 Unauthorized
```bash
# Verificar se as variáveis estão carregadas
node -e "console.log(process.env.BLACKCAT_PUBLIC_KEY)"
node -e "console.log(process.env.ALLOWPAY_SECRET_KEY)"

# Se estiverem undefined, reiniciar o servidor
pm2 restart all
# ou
npm run dev
```

### Problema: Banco de dados não conecta
```bash
# Verificar DATABASE_URL
node -e "console.log(process.env.DATABASE_URL)"

# Testar conexão
npx prisma db push
```

### Problema: Porta não acessível
```bash
# Verificar se a porta está aberta
netstat -tlnp | grep :3434

# Verificar firewall
ufw status
```

## ✅ Checklist Final

- [ ] Código deployado no VPS
- [ ] Variáveis de ambiente configuradas
- [ ] Dependências instaladas
- [ ] Banco de dados configurado
- [ ] Servidor rodando
- [ ] Endpoint testado
- [ ] Webhooks configurados
- [ ] Domínio funcionando

## 🎯 Resultado Esperado

Após a configuração, o sistema deve:
- ✅ Processar pagamentos sem erros
- ✅ Usar credenciais corretas
- ✅ Aplicar lógica 7x3
- ✅ Salvar no banco de dados
- ✅ Responder webhooks

## 📞 Suporte

Se houver problemas:
1. Verificar logs do servidor
2. Testar variáveis de ambiente
3. Verificar conectividade com APIs
4. Testar endpoint localmente no VPS
