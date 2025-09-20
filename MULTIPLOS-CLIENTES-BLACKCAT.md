# 🔐 MÚLTIPLOS CLIENTES USANDO BLACKCAT

## 🎯 **RESPOSTA DIRETA: CADA CLIENTE TEM SUAS PRÓPRIAS CREDENCIAIS!**

### **✅ COMO FUNCIONA:**

1. **Cada cliente** tem suas próprias credenciais do BlackCat
2. **Cada cliente** envia suas credenciais a cada venda
3. **Sistema usa** as credenciais do cliente para processar pagamentos
4. **Sistema 7x3** funciona normalmente para cada cliente

## 🔄 **FLUXO REAL COM MÚLTIPLOS CLIENTES**

### **1. CLIENTE A - BlackCat:**

```javascript
// Cliente A envia suas credenciais
{
  "credentials": {
    "token": "sk_blackcat_clienteA_123",        // Secret key do Cliente A
    "name": "João Silva"                        // Nome do Cliente A
  },
  "amount": 100,
  "product": { "title": "Produto A" },
  "customer": { /* dados do cliente */ }
}
```

### **2. CLIENTE B - BlackCat:**

```javascript
// Cliente B envia suas credenciais
{
  "credentials": {
    "token": "sk_blackcat_clienteB_456",        // Secret key do Cliente B
    "name": "Maria Santos"                      // Nome do Cliente B
  },
  "amount": 200,
  "product": { "title": "Produto B" },
  "customer": { /* dados do cliente */ }
}
```

### **3. CLIENTE C - BlackCat:**

```javascript
// Cliente C envia suas credenciais
{
  "credentials": {
    "token": "sk_blackcat_clienteC_789",        // Secret key do Cliente C
    "name": "Pedro Oliveira"                    // Nome do Cliente C
  },
  "amount": 300,
  "product": { "title": "Produto C" },
  "customer": { /* dados do cliente */ }
}
```

## 🗄️ **DADOS SALVOS NO BANCO**

### **1. CLIENTES CRIADOS AUTOMATICAMENTE:**

```sql
-- Cliente A
INSERT INTO "Client" VALUES (
  'uuid-clienteA',
  'João Silva',
  NULL,
  'sk_blackcat_clienteA_123',        -- Secret key do Cliente A
  false,
  NOW()
);

-- Cliente B
INSERT INTO "Client" VALUES (
  'uuid-clienteB',
  'Maria Santos',
  NULL,
  'sk_blackcat_clienteB_456',        -- Secret key do Cliente B
  false,
  NOW()
);

-- Cliente C
INSERT INTO "Client" VALUES (
  'uuid-clienteC',
  'Pedro Oliveira',
  NULL,
  'sk_blackcat_clienteC_789',        -- Secret key do Cliente C
  false,
  NOW()
);
```

### **2. OFERTAS CRIADAS AUTOMATICAMENTE:**

```sql
-- Oferta do Cliente A
INSERT INTO "Offer" VALUES (
  'uuid-ofertaA',
  'Produto A',
  false,
  'uuid-clienteA',                   -- Cliente A
  NOW()
);

-- Oferta do Cliente B
INSERT INTO "Offer" VALUES (
  'uuid-ofertaB',
  'Produto B',
  false,
  'uuid-clienteB',                   -- Cliente B
  NOW()
);

-- Oferta do Cliente C
INSERT INTO "Offer" VALUES (
  'uuid-ofertaC',
  'Produto C',
  false,
  'uuid-clienteC',                   -- Cliente C
  NOW()
);
```

## 🔄 **SISTEMA 7x3 PARA CADA CLIENTE**

### **1. CLIENTE A - Sistema 7x3:**

```
Venda #1: cycle = 1 % 10 = 1 → < 7 → Cliente A (70%)
Venda #2: cycle = 2 % 10 = 2 → < 7 → Cliente A (70%)
Venda #3: cycle = 3 % 10 = 3 → < 7 → Cliente A (70%)
Venda #4: cycle = 4 % 10 = 4 → < 7 → Cliente A (70%)
Venda #5: cycle = 5 % 10 = 5 → < 7 → Cliente A (70%)
Venda #6: cycle = 6 % 10 = 6 → < 7 → Cliente A (70%)
Venda #7: cycle = 7 % 10 = 7 → >= 7 → useTax=false → Cliente A (70%)
Venda #8: cycle = 8 % 10 = 8 → >= 7 → useTax=false → Cliente A (70%)
Venda #9: cycle = 9 % 10 = 9 → >= 7 → useTax=false → Cliente A (70%)
Venda #10: cycle = 10 % 10 = 0 → < 7 → Cliente A (70%)
```

### **2. CLIENTE B - Sistema 7x3:**

```
Venda #1: cycle = 1 % 10 = 1 → < 7 → Cliente B (70%)
Venda #2: cycle = 2 % 10 = 2 → < 7 → Cliente B (70%)
Venda #3: cycle = 3 % 10 = 3 → < 7 → Cliente B (70%)
Venda #4: cycle = 4 % 10 = 4 → < 7 → Cliente B (70%)
Venda #5: cycle = 5 % 10 = 5 → < 7 → Cliente B (70%)
Venda #6: cycle = 6 % 10 = 6 → < 7 → Cliente B (70%)
Venda #7: cycle = 7 % 10 = 7 → >= 7 → useTax=false → Cliente B (70%)
Venda #8: cycle = 8 % 10 = 8 → >= 7 → useTax=false → Cliente B (70%)
Venda #9: cycle = 9 % 10 = 9 → >= 7 → useTax=false → Cliente B (70%)
Venda #10: cycle = 10 % 10 = 0 → < 7 → Cliente B (70%)
```

### **3. CLIENTE C - Sistema 7x3:**

```
Venda #1: cycle = 1 % 10 = 1 → < 7 → Cliente C (70%)
Venda #2: cycle = 2 % 10 = 2 → < 7 → Cliente C (70%)
Venda #3: cycle = 3 % 10 = 3 → < 7 → Cliente C (70%)
Venda #4: cycle = 4 % 10 = 4 → < 7 → Cliente C (70%)
Venda #5: cycle = 5 % 10 = 5 → < 7 → Cliente C (70%)
Venda #6: cycle = 6 % 10 = 6 → < 7 → Cliente C (70%)
Venda #7: cycle = 7 % 10 = 7 → >= 7 → useTax=false → Cliente C (70%)
Venda #8: cycle = 8 % 10 = 8 → >= 7 → useTax=false → Cliente C (70%)
Venda #9: cycle = 9 % 10 = 9 → >= 7 → useTax=false → Cliente C (70%)
Venda #10: cycle = 10 % 10 = 0 → < 7 → Cliente C (70%)
```

## 🔧 **COMO O SISTEMA PROCESSA**

### **1. CLIENTE A FAZ VENDA:**

```typescript
// Sistema recebe venda do Cliente A
const data: CreatePixBody = req.body;
const clientToken = 'sk_blackcat_clienteA_123';

// Busca cliente A
let client = await prisma.client.findUnique({
  where: { token: clientToken },
});

// Cria cliente A se não existir
if (!client) {
  client = await prisma.client.create({
    data: {
      name: 'João Silva',
      token: 'sk_blackcat_clienteA_123',
      useTax: false,
    },
  });
}

// Sistema decide (7x3)
if (cycle < 7) {
  // 70% - Usa credenciais do Cliente A
  tokenToUse = 'sk_blackcat_clienteA_123';
  toClient = true;
} else {
  // 30% - Usa credenciais do Paulo
  tokenToUse = myCredentials.secret; // BlackCat do Paulo
  toClient = false;
}

// Processa pagamento com BlackCat
const auth = 'Basic ' + Buffer.from(myCredentials.public + ':' + tokenToUse).toString('base64');
const response = await fetch('https://api.blackcatpagamentos.com/v1/transactions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': auth,
  },
  body: JSON.stringify(paymentData)
});
```

### **2. CLIENTE B FAZ VENDA:**

```typescript
// Sistema recebe venda do Cliente B
const data: CreatePixBody = req.body;
const clientToken = 'sk_blackcat_clienteB_456';

// Busca cliente B
let client = await prisma.client.findUnique({
  where: { token: clientToken },
});

// Cria cliente B se não existir
if (!client) {
  client = await prisma.client.create({
    data: {
      name: 'Maria Santos',
      token: 'sk_blackcat_clienteB_456',
      useTax: false,
    },
  });
}

// Sistema decide (7x3)
if (cycle < 7) {
  // 70% - Usa credenciais do Cliente B
  tokenToUse = 'sk_blackcat_clienteB_456';
  toClient = true;
} else {
  // 30% - Usa credenciais do Paulo
  tokenToUse = myCredentials.secret; // BlackCat do Paulo
  toClient = false;
}

// Processa pagamento com BlackCat
const auth = 'Basic ' + Buffer.from(myCredentials.public + ':' + tokenToUse).toString('base64');
const response = await fetch('https://api.blackcatpagamentos.com/v1/transactions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': auth,
  },
  body: JSON.stringify(paymentData)
});
```

## 📊 **EXEMPLO PRÁTICO COMPLETO**

### **CENÁRIO: 3 Clientes usando BlackCat**

#### **1. Cliente A (João Silva):**
- **Secret Key**: `sk_blackcat_joao_123`
- **Public Key**: `pk_blackcat_joao_123`
- **Sistema 7x3**: 70% para João, 30% para Paulo

#### **2. Cliente B (Maria Santos):**
- **Secret Key**: `sk_blackcat_maria_456`
- **Public Key**: `pk_blackcat_maria_456`
- **Sistema 7x3**: 70% para Maria, 30% para Paulo

#### **3. Cliente C (Pedro Oliveira):**
- **Secret Key**: `sk_blackcat_pedro_789`
- **Public Key**: `pk_blackcat_pedro_789`
- **Sistema 7x3**: 70% para Pedro, 30% para Paulo

### **RESULTADO:**
- **João**: Recebe 70% das suas vendas
- **Maria**: Recebe 70% das suas vendas
- **Pedro**: Recebe 70% das suas vendas
- **Paulo**: Recebe 30% das vendas de todos os clientes

## ⚠️ **PONTOS IMPORTANTES**

### **1. CADA CLIENTE É INDEPENDENTE:**
- ✅ **Cada cliente** tem suas próprias credenciais
- ✅ **Cada cliente** tem seu próprio sistema 7x3
- ✅ **Cada cliente** é criado automaticamente

### **2. SISTEMA 7x3 FUNCIONA PARA CADA CLIENTE:**
- ✅ **70%** das vendas de cada cliente vão para o cliente
- ✅ **30%** das vendas de cada cliente vão para o Paulo
- ✅ **Contagem** é por oferta de cada cliente

### **3. BLACKCAT É USADO POR TODOS:**
- ✅ **Todos os clientes** usam BlackCat
- ✅ **Cada cliente** usa suas próprias credenciais
- ✅ **Paulo** usa suas credenciais para receber 30%

## 🚀 **RESUMO EXECUTIVO**

### **COMO FUNCIONA:**
1. **Cada cliente** configura suas credenciais do BlackCat
2. **Cada cliente** envia credenciais a cada venda
3. **Sistema cria** cada cliente automaticamente
4. **Sistema 7x3** funciona para cada cliente individualmente

### **O QUE CADA CLIENTE PRECISA:**
1. **Secret key** do BlackCat
2. **Public key** do BlackCat
3. **Integrar** com sua API

### **O QUE VOCÊ (PAULO) PRECISA:**
1. **Configurar checkout** para cada oferta
2. **Configurar useTax = true** para receber vendas
3. **Monitorar** vendas via Discord/PushCut

---

**Agora você entende: Cada cliente tem suas próprias credenciais do BlackCat e o sistema 7x3 funciona para cada um individualmente! 🚀**


