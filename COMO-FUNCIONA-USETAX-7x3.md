# ⚙️ COMO FUNCIONA O useTax E A REGRA 7x3

## 🎯 **RESPOSTA DIRETA À SUA PERGUNTA**

### **❌ NÃO! Por padrão NÃO vai 100% para o cliente!**

**A regra 7x3 funciona DIFERENTE dependendo do controlador:**

1. **`create-pix.ts`**: **SEMPRE** usa regra 7x3 (70% cliente, 30% Paulo)
2. **Outros controladores**: Dependem do `useTax` (padrão = 100% cliente)

## 🔍 **ANÁLISE DETALHADA POR CONTROLADOR**

### **1. create-pix.ts (Rota `/gerarpix`) - SEMPRE 7x3**

```typescript
const useClientToken = total % 10 < 7;  // 70% cliente, 30% Paulo
const tokenToUse = useClientToken ? clientToken : myCredentials.secret;
```

**COMPORTAMENTO:**
- ✅ **70% das vendas** → Cliente (usa credenciais do cliente)
- ✅ **30% das vendas** → Paulo (usa credenciais do Paulo)
- ✅ **NÃO depende** do `useTax`
- ✅ **SEMPRE funciona** a regra 7x3

### **2. iexperience.ts (Rota `/iexperience`) - DEPENDE DO useTax**

```typescript
const cycle = nextCount % 11;

if (cycle < 7) {
  // 70% - SEMPRE cliente
  tokenToUse = clientToken;
  toClient = true;
} else if (cycle < 10) {
  // 30% - DECISÃO baseada no useTax
  if (offer.useTax) {
    // Se useTax = true → Paulo
    tokenToUse = myCredentials.secret;
    toClient = false;
  } else {
    // Se useTax = false → Cliente
    tokenToUse = clientToken;
    toClient = true;
  }
}
```

**COMPORTAMENTO:**
- ✅ **70% das vendas** → Cliente (sempre)
- ✅ **30% das vendas** → Depende do `useTax`:
  - `useTax = false` (padrão) → Cliente (100% total)
  - `useTax = true` (manual) → Paulo (70% cliente, 30% Paulo)

### **3. lunacheckout.ts (Rota `/lunarcash`) - DEPENDE DO useTax**

```typescript
const cycle = nextCount % 10;

if (cycle < 7) {
  // 70% - SEMPRE cliente
  tokenToUse = clientToken;
  toClient = true;
} else if (cycle < 10) {
  // 30% - DECISÃO baseada no useTax
  if (offer.useTax) {
    // Se useTax = true → Paulo
    tokenToUse = myCredentials.secret;
    toClient = false;
  } else {
    // Se useTax = false → Cliente
    tokenToUse = clientToken;
    toClient = true;
  }
}
```

**COMPORTAMENTO:**
- ✅ **70% das vendas** → Cliente (sempre)
- ✅ **30% das vendas** → Depende do `useTax`:
  - `useTax = false` (padrão) → Cliente (100% total)
  - `useTax = true` (manual) → Paulo (70% cliente, 30% Paulo)

## 📊 **TABELA COMPARATIVA**

| Controlador | Rota | Comportamento Padrão | Comportamento com useTax=true |
|-------------|------|---------------------|-------------------------------|
| `create-pix.ts` | `/gerarpix` | **70% cliente, 30% Paulo** | **70% cliente, 30% Paulo** |
| `iexperience.ts` | `/iexperience` | **100% cliente** | **70% cliente, 30% Paulo** |
| `lunacheckout.ts` | `/lunarcash` | **100% cliente** | **70% cliente, 30% Paulo** |

## 🔄 **EXEMPLOS PRÁTICOS**

### **EXEMPLO 1: create-pix.ts (SEMPRE 7x3)**

```javascript
// Cliente faz venda via /gerarpix
const response = await fetch('https://sua-api-pix.com/gerarpix', {
  method: 'POST',
  body: JSON.stringify({
    credentials: { token: 'sk_cliente', name: 'Cliente' },
    amount: 100,
    product: { title: 'Produto Teste' },
    customer: { /* dados */ }
  })
});

// RESULTADO: 70% cliente, 30% Paulo (SEMPRE)
```

### **EXEMPLO 2: iexperience.ts (useTax = false - PADRÃO)**

```javascript
// Cliente faz venda via /iexperience
const response = await fetch('https://sua-api-pix.com/iexperience', {
  method: 'POST',
  body: JSON.stringify({
    credentials: { token: 'sk_cliente', name: 'Cliente' },
    amount: 100,
    product: { title: 'Produto Teste' },
    customer: { /* dados */ }
  })
});

// RESULTADO: 100% cliente (useTax = false por padrão)
```

### **EXEMPLO 3: iexperience.ts (useTax = true - MANUAL)**

```javascript
// 1. Alterar useTax para true
await fetch('https://sua-api-pix.com/use-tax', {
  method: 'POST',
  body: JSON.stringify({
    offerId: 'uuid-da-oferta',
    useTax: true
  })
});

// 2. Cliente faz venda via /iexperience
const response = await fetch('https://sua-api-pix.com/iexperience', {
  method: 'POST',
  body: JSON.stringify({
    credentials: { token: 'sk_cliente', name: 'Cliente' },
    amount: 100,
    product: { title: 'Produto Teste' },
    customer: { /* dados */ }
  })
});

// RESULTADO: 70% cliente, 30% Paulo (useTax = true)
```

## ⚠️ **PONTOS IMPORTANTES**

### **1. create-pix.ts É DIFERENTE:**
- ✅ **SEMPRE** usa regra 7x3
- ✅ **NÃO depende** do `useTax`
- ✅ **70% cliente, 30% Paulo** sempre
- ✅ **É o controlador principal** (`/gerarpix`)

### **2. Outros Controladores Dependem do useTax:**
- ✅ **useTax = false** (padrão) → 100% cliente
- ✅ **useTax = true** (manual) → 70% cliente, 30% Paulo
- ✅ **Precisa ativar** manualmente para receber vendas

### **3. useTax É Por Oferta:**
- ✅ **Cada oferta** tem seu próprio `useTax`
- ✅ **Alterar uma oferta** não afeta outras
- ✅ **Controle granular** por produto

## 🔧 **COMO ATIVAR A REGRA 7x3**

### **1. Para create-pix.ts:**
- ✅ **Já funciona** automaticamente
- ✅ **Não precisa** fazer nada
- ✅ **70% cliente, 30% Paulo** sempre

### **2. Para outros controladores:**
- ✅ **Alterar useTax** para `true`
- ✅ **Usar endpoint** `/use-tax`
- ✅ **Ou alterar** diretamente no banco

### **3. Endpoint para Alterar useTax:**
```bash
# Ativar regra 7x3
curl -X POST https://sua-api-pix.com/use-tax \
  -H "Content-Type: application/json" \
  -d '{
    "offerId": "uuid-da-oferta",
    "useTax": true
  }'

# Desativar regra 7x3
curl -X POST https://sua-api-pix.com/use-tax \
  -H "Content-Type: application/json" \
  -d '{
    "offerId": "uuid-da-oferta",
    "useTax": false
  }'
```

## 🚀 **RESUMO EXECUTIVO**

### **PERGUNTA: "Por padrão sempre vai ser cadastrado para as vendas irem 100% pro cliente?"**

### **RESPOSTA: DEPENDE DO CONTROLADOR!**

1. **`/gerarpix` (create-pix.ts)**: ❌ **NÃO!** Sempre 70% cliente, 30% Paulo
2. **`/iexperience` (iexperience.ts)**: ✅ **SIM!** 100% cliente (padrão)
3. **`/lunarcash` (lunacheckout.ts)**: ✅ **SIM!** 100% cliente (padrão)

### **PARA ATIVAR A REGRA 7x3:**
- **`/gerarpix`**: ✅ **Já funciona** automaticamente
- **Outros controladores**: ✅ **Alterar useTax** para `true`

### **RECOMENDAÇÃO:**
- ✅ **Use `/gerarpix`** para regra 7x3 automática
- ✅ **Use outros controladores** apenas se quiser 100% cliente
- ✅ **Altere useTax** se quiser 7x3 em outros controladores

---

**Agora você entende exatamente como funciona! 🚀**

