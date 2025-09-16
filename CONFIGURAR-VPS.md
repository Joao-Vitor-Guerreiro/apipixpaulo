# 🌐 Configuração na VPS - Garantir que Funcione

## 🎯 **RESPOSTA: SIM! Vai funcionar na VPS, MAS precisa configurar!**

### ✅ **O que está funcionando localmente:**
- ✅ Variáveis de ambiente carregadas
- ✅ api.ts identificando as chaves
- ✅ APIs externas funcionando
- ✅ Sistema pronto para produção

### ⚠️ **O que precisa fazer na VPS:**

## 🔧 **Passo 1: Configurar Variáveis no EasyPanel**

### **Opção A: Via Interface (Recomendado)**
1. Acesse seu projeto no EasyPanel
2. Vá em **Settings** → **Environment Variables**
3. Adicione cada variável:

```
DATABASE_URL = postgresql://painelpixmanager_owner:npg_ut0TLISZb4sc@ep-crimson-snow-ac4i3dtg-pooler.sa-east-1.aws.neon.tech/painelpixmanager?sslmode=require

BLACKCAT_PUBLIC_KEY = sua_public_key_aqui

BLACKCAT_SECRET_KEY = sua_secret_key_aqui

ALLOWPAY_SECRET_KEY = sua_secret_key_aqui

ALLOWPAY_COMPANY_ID = seu_company_id_aqui
```

### **Opção B: Via Terminal SSH**
```bash
# Conectar via SSH
ssh usuario@seu-servidor.com

# Ir para o diretório do projeto
cd /caminho/do/projeto

# Criar arquivo .env
nano .env

# Adicionar conteúdo:
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
BLACKCAT_PUBLIC_KEY="sua_public_key_aqui"
BLACKCAT_SECRET_KEY="sua_secret_key_aqui"
ALLOWPAY_SECRET_KEY="sua_secret_key_aqui"
ALLOWPAY_COMPANY_ID="seu_company_id_aqui"

# Salvar e sair
Ctrl + X
Y
Enter
```

## 🚀 **Passo 2: Deploy do Código**

```bash
# No seu computador local
git add .
git commit -m "fix: corrige erros e configura credenciais"
git push origin main

# Na VPS (via SSH)
git pull origin main
npm install
npx prisma migrate deploy
```

## 🧪 **Passo 3: Testar na VPS**

```bash
# Na VPS, testar se as variáveis estão carregadas
node testar-vps-completo.js

# Se tudo estiver OK, iniciar servidor
npm run dev
```

## ✅ **Resultado Esperado na VPS:**

Após configurar corretamente:
- ✅ Variáveis de ambiente carregadas
- ✅ api.ts identificando as chaves
- ✅ APIs externas funcionando
- ✅ Sistema processando pagamentos
- ✅ Sem erros 401

## 🔍 **Como Verificar se Está Funcionando:**

### **1. Testar Variáveis:**
```bash
node -e "console.log('BLACKCAT_SECRET_KEY:', process.env.BLACKCAT_SECRET_KEY)"
```

### **2. Testar Endpoint:**
```bash
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

## 🚨 **Troubleshooting:**

### **Problema: Erro 401 na VPS**
```bash
# Verificar se as variáveis estão carregadas
node testar-vps-completo.js

# Se não estiverem, verificar configuração no EasyPanel
```

### **Problema: Variáveis não carregam**
```bash
# Verificar se o arquivo .env existe
ls -la .env

# Verificar conteúdo
cat .env

# Reiniciar servidor
npm run dev
```

## 🎯 **Resumo Final:**

- ✅ **Local**: Funcionando perfeitamente
- ✅ **VPS**: Vai funcionar se configurar as variáveis
- ✅ **api.ts**: Identifica as chaves corretamente
- ✅ **Sistema**: Pronto para produção

**A resposta é SIM! Vai funcionar na VPS, mas precisa configurar as variáveis de ambiente!** 🚀
