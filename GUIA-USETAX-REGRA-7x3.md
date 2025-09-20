# ⚙️ GUIA COMPLETO: useTax E REGRA 7x3

## 🎯 **RESPOSTA DIRETA ÀS SUAS PERGUNTAS**

### **1. useTax É SALVO COMO FALSE POR PADRÃO?**
✅ **SIM!** O `useTax` é sempre salvo como `false` por padrão em todas as ofertas.

### **2. COMO FUNCIONA A REGRA 7x3 COM useTax = false?**
✅ **Com `useTax = false`, a regra 7x3 funciona NORMALMENTE:**
- **70%** das vendas vão para o cliente
- **30%** das vendas vão para o Paulo (BlackCat)

## 🔍 **ANÁLISE DETALHADA DO CÓDIGO**

### **1. CRIAÇÃO DE OFERTAS (useTax = false)**

```typescript
// Em todos os controladores, as ofertas são criadas com useTax = false
offer = await prisma.offer.create({
  data: {
    id: offerInfo.id,
    name: offerInfo.name,
    useTax: false,  // ⚠️ SEMPRE FALSE POR PADRÃO
    clientId: client.id,
  },
});
```

### **2. LÓGICA DA REGRA 7x3 COM useTax**

```typescript
const cycle = nextCount % 10; // ou % 11 no iexperience

if (cycle < 7) {
  // 70% - SEMPRE vai para o cliente
  tokenToUse = clientToken;
  toClient = true;
} else if (cycle < 10) {
  // 30% - DECISÃO baseada no useTax
  if (offer.useTax) {
    // Se useTax = true → Vai para Paulo (BlackCat)
    tokenToUse = myCredentials.secret;
    toClient = false;
    provider = "ghost"; // BlackCat
  } else {
    // Se useTax = false → Vai para cliente
    tokenToUse = clientToken;
    toClient = true;
  }
}
```

## 📊 **COMPORTAMENTO PRÁTICO**

### **1. COM useTax = false (PADRÃO):**

```
Venda #1: cycle = 1 % 10 = 1 → < 7 → Cliente (70%)
Venda #2: cycle = 2 % 10 = 2 → < 7 → Cliente (70%)
Venda #3: cycle = 3 % 10 = 3 → < 7 → Cliente (70%)
Venda #4: cycle = 4 % 10 = 4 → < 7 → Cliente (70%)
Venda #5: cycle = 5 % 10 = 5 → < 7 → Cliente (70%)
Venda #6: cycle = 6 % 10 = 6 → < 7 → Cliente (70%)
Venda #7: cycle = 7 % 10 = 7 → >= 7 → useTax=false → Cliente (70%)
Venda #8: cycle = 8 % 10 = 8 → >= 7 → useTax=false → Cliente (70%)
Venda #9: cycle = 9 % 10 = 9 → >= 7 → useTax=false → Cliente (70%)
Venda #10: cycle = 10 % 10 = 0 → < 7 → Cliente (70%)
```

**RESULTADO**: **100% das vendas vão para o cliente!**

### **2. COM useTax = true (MANUAL):**

```
Venda #1: cycle = 1 % 10 = 1 → < 7 → Cliente (70%)
Venda #2: cycle = 2 % 10 = 2 → < 7 → Cliente (70%)
Venda #3: cycle = 3 % 10 = 3 → < 7 → Cliente (70%)
Venda #4: cycle = 4 % 10 = 4 → < 7 → Cliente (70%)
Venda #5: cycle = 5 % 10 = 5 → < 7 → Cliente (70%)
Venda #6: cycle = 6 % 10 = 6 → < 7 → Cliente (70%)
Venda #7: cycle = 7 % 10 = 7 → >= 7 → useTax=true → Paulo (30%)
Venda #8: cycle = 8 % 10 = 8 → >= 7 → useTax=true → Paulo (30%)
Venda #9: cycle = 9 % 10 = 9 → >= 7 → useTax=true → Paulo (30%)
Venda #10: cycle = 10 % 10 = 0 → < 7 → Cliente (70%)
```

**RESULTADO**: **70% cliente, 30% Paulo (regra 7x3 normal)**

## 🔧 **COMO ALTERAR useTax**

### **1. VIA API (Recomendado):**

```bash
# Alterar useTax para true
curl -X POST https://sua-api-pix.com/use-tax \
  -H "Content-Type: application/json" \
  -d '{
    "offerId": "uuid-da-oferta",
    "useTax": true
  }'

# Alterar useTax para false
curl -X POST https://sua-api-pix.com/use-tax \
  -H "Content-Type: application/json" \
  -d '{
    "offerId": "uuid-da-oferta",
    "useTax": false
  }'
```

### **2. VIA BANCO DE DADOS:**

```sql
-- Alterar useTax para true
UPDATE "Offer" 
SET "useTax" = true 
WHERE id = 'uuid-da-oferta';

-- Alterar useTax para false
UPDATE "Offer" 
SET "useTax" = false 
WHERE id = 'uuid-da-oferta';
```

## 📋 **DIFERENÇAS ENTRE GATEWAYS**

### **1. iExperience (cycle % 11):**
```typescript
const cycle = nextCount % 11; // 11 em vez de 10

if (cycle < 7) {
  // 70% - Cliente
} else if (cycle < 10) {
  // 30% - Decisão baseada no useTax
} else {
  // 10% - Sempre cliente (fallback)
}
```

### **2. LunarCash (cycle % 10):**
```typescript
const cycle = nextCount % 10; // 10 normal

if (cycle < 7) {
  // 70% - Cliente
} else if (cycle < 10) {
  // 30% - Decisão baseada no useTax
}
```

### **3. create-pix (cycle % 10):**
```typescript
const cycle = nextCount % 10; // 10 normal

if (cycle < 7) {
  // 70% - Cliente
} else {
  // 30% - Sempre Paulo (não usa useTax)
}
```

## ⚠️ **PONTOS IMPORTANTES**

### **1. useTax = false (PADRÃO):**
- ✅ **100% das vendas** vão para o cliente
- ✅ **0% das vendas** vão para o Paulo
- ✅ **Regra 7x3 não funciona** (sempre cliente)

### **2. useTax = true (MANUAL):**
- ✅ **70% das vendas** vão para o cliente
- ✅ **30% das vendas** vão para o Paulo
- ✅ **Regra 7x3 funciona** normalmente

### **3. create-pix (DIFERENTE):**
- ✅ **Sempre usa regra 7x3** (não depende do useTax)
- ✅ **70% cliente, 30% Paulo** sempre

## 🚀 **EXEMPLO PRÁTICO**

### **Cenário 1: useTax = false (Padrão)**
```javascript
// Cliente faz venda
const response = await fetch('https://sua-api-pix.com/gerarpix', {
  method: 'POST',
  body: JSON.stringify({
    credentials: { token: 'sk_cliente', name: 'Cliente' },
    amount: 100,
    product: { title: 'Produto Teste' },
    customer: { /* dados */ }
  })
});

// Resultado: 100% vai para o cliente (useTax = false)
```

### **Cenário 2: useTax = true (Manual)**
```javascript
// 1. Alterar useTax para true
await fetch('https://sua-api-pix.com/use-tax', {
  method: 'POST',
  body: JSON.stringify({
    offerId: 'uuid-da-oferta',
    useTax: true
  })
});

// 2. Cliente faz venda
const response = await fetch('https://sua-api-pix.com/gerarpix', {
  // ... mesma requisição
});

// Resultado: 70% cliente, 30% Paulo (regra 7x3)
```

## 📊 **RESUMO EXECUTIVO**

| useTax | Comportamento | Cliente | Paulo |
|--------|---------------|---------|-------|
| `false` (padrão) | 100% cliente | 100% | 0% |
| `true` (manual) | Regra 7x3 | 70% | 30% |

## 🔧 **RECOMENDAÇÕES**

### **1. Para Receber Vendas (Paulo):**
- ✅ Alterar `useTax` para `true` nas ofertas desejadas
- ✅ Usar endpoint `/use-tax` para alterar
- ✅ Monitorar vendas via Discord/PushCut

### **2. Para Cliente Receber Tudo:**
- ✅ Manter `useTax = false` (padrão)
- ✅ Cliente recebe 100% das vendas
- ✅ Paulo não recebe nada

### **3. Para Regra 7x3 Normal:**
- ✅ Alterar `useTax` para `true`
- ✅ 70% cliente, 30% Paulo
- ✅ Funcionamento esperado

---

**Agora você entende como funciona o useTax e sua relação com a regra 7x3! 🚀**

