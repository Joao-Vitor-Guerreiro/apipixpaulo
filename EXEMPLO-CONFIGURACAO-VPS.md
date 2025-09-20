# 🎯 Exemplo Prático: Configuração no EasyPanel

## 📱 Interface do EasyPanel

### 1. **Acessar Environment Variables**
```
EasyPanel Dashboard
├── Seu Projeto
    ├── Settings
        └── Environment Variables ← Clique aqui
```

### 2. **Adicionar Variáveis (uma por uma)**

#### **Variável 1: DATABASE_URL**
```
Name: DATABASE_URL
Value: postgresql://painelpixmanager_owner:npg_ut0TLISZb4sc@ep-crimson-snow-ac4i3dtg-pooler.sa-east-1.aws.neon.tech/painelpixmanager?sslmode=require
```

#### **Variável 2: BLACKCAT_PUBLIC_KEY**
```
Name: BLACKCAT_PUBLIC_KEY
Value: sua_public_key_aqui
```

#### **Variável 3: BLACKCAT_SECRET_KEY**
```
Name: BLACKCAT_SECRET_KEY
Value: sua_secret_key_aqui
```

#### **Variável 4: ALLOWPAY_SECRET_KEY**
```
Name: ALLOWPAY_SECRET_KEY
Value: sua_secret_key_aqui
```

#### **Variável 5: ALLOWPAY_COMPANY_ID**
```
Name: ALLOWPAY_COMPANY_ID
Value: seu_company_id_aqui
```

## 🖥️ Terminal SSH (Alternativa)

### 1. **Conectar via SSH**
```bash
ssh usuario@seu-servidor.com
cd /caminho/do/projeto
```

### 2. **Criar arquivo .env**
```bash
nano .env
```

### 3. **Adicionar conteúdo**
```env
DATABASE_URL="postgresql://painelpixmanager_owner:npg_ut0TLISZb4sc@ep-crimson-snow-ac4i3dtg-pooler.sa-east-1.aws.neon.tech/painelpixmanager?sslmode=require"

BLACKCAT_PUBLIC_KEY="sua_public_key_aqui"
BLACKCAT_SECRET_KEY="sua_secret_key_aqui"

ALLOWPAY_SECRET_KEY="sua_secret_key_aqui"
ALLOWPAY_COMPANY_ID="93b610dd-202b-498f-9007-57195f5eb67b"
```

### 4. **Salvar e sair**
```
Ctrl + X
Y
Enter
```

## 🧪 Testar Configuração

### 1. **Verificar variáveis**
```bash
node verificar-variaveis-vps.js
```

### 2. **Testar sistema completo**
```bash
node testar-vps.js
```

### 3. **Reiniciar servidor**
```bash
npm run dev
```

## 🔄 Fluxo Completo

```
1. Configurar variáveis no EasyPanel
2. Fazer deploy do código
3. Instalar dependências: npm install
4. Configurar banco: npx prisma migrate deploy
5. Testar variáveis: node verificar-variaveis-vps.js
6. Iniciar servidor: npm run dev
7. Testar endpoint: node testar-vps.js
```

## ✅ Resultado Esperado

Após a configuração:
- ✅ Variáveis carregadas corretamente
- ✅ Credenciais funcionando
- ✅ APIs externas respondendo
- ✅ Sistema processando pagamentos
- ✅ Banco de dados funcionando

## 🚨 Troubleshooting

### Problema: Variáveis não carregam
```bash
# Verificar se estão configuradas
node -e "console.log(process.env.BLACKCAT_PUBLIC_KEY)"

# Se retornar undefined, verificar configuração no EasyPanel
```

### Problema: Erro 401 nas APIs
```bash
# Verificar credenciais
node verificar-variaveis-vps.js

# Se estiverem corretas, verificar se as APIs estão funcionando
```

### Problema: Servidor não inicia
```bash
# Verificar logs
npm run dev

# Verificar dependências
npm install
```
