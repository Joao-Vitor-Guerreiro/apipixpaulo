# ⚙️ COMO USAR A ROTA /use-tax

## 🎯 **RESPOSTA DIRETA: USE A ROTA `/use-tax`**

### **✅ ROTA PARA LIGAR E DESLIGAR useTax:**

- **Rota**: `POST /use-tax`
- **Função**: Ligar e desligar a regra 7x3
- **Controlador**: `clientController.useTax`

## 🔧 **COMO FUNCIONA A ROTA**

### **1. ESTRUTURA DA REQUISIÇÃO:**

```javascript
POST /use-tax
Content-Type: application/json

{
  "offerId": "uuid-da-oferta",
  "useTax": true  // ou false
}
```

### **2. PARÂMETROS NECESSÁRIOS:**

- **`offerId`**: ID da oferta (obrigatório)
- **`useTax`**: `true` ou `false` (obrigatório)

### **3. RESPOSTA DA API:**

```javascript
{
  "id": "uuid-da-oferta",
  "name": "Nome da Oferta",
  "description": "Descrição da Oferta",
  "useTax": true,  // ou false
  "createdAt": "2024-01-01T00:00:00.000Z",
  "clientId": "uuid-do-cliente"
}
```

## 🔄 **EXEMPLOS PRÁTICOS**

### **1. LIGAR useTax (Ativar regra 7x3):**

```bash
# Via cURL
curl -X POST https://sua-api-pix.com/use-tax \
  -H "Content-Type: application/json" \
  -d '{
    "offerId": "uuid-da-oferta",
    "useTax": true
  }'
```

```javascript
// Via JavaScript
const response = await fetch('https://sua-api-pix.com/use-tax', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    offerId: 'uuid-da-oferta',
    useTax: true
  })
});

const result = await response.json();
console.log('useTax ativado:', result);
```

### **2. DESLIGAR useTax (Desativar regra 7x3):**

```bash
# Via cURL
curl -X POST https://sua-api-pix.com/use-tax \
  -H "Content-Type: application/json" \
  -d '{
    "offerId": "uuid-da-oferta",
    "useTax": false
  }'
```

```javascript
// Via JavaScript
const response = await fetch('https://sua-api-pix.com/use-tax', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    offerId: 'uuid-da-oferta',
    useTax: false
  })
});

const result = await response.json();
console.log('useTax desativado:', result);
```

## 📊 **COMPORTAMENTO APÓS ALTERAR useTax**

### **1. useTax = true (Regra 7x3 Ativada):**

```javascript
// Cliente faz venda via /iexperience ou /lunarcash
const response = await fetch('https://sua-api-pix.com/iexperience', {
  method: 'POST',
  body: JSON.stringify({
    credentials: { token: 'sk_cliente', name: 'Cliente' },
    amount: 100,
    product: { title: 'Produto Teste' },
    customer: { /* dados */ }
  })
});

// RESULTADO: 70% cliente, 30% Paulo (regra 7x3)
```

### **2. useTax = false (Regra 7x3 Desativada):**

```javascript
// Cliente faz venda via /iexperience ou /lunarcash
const response = await fetch('https://sua-api-pix.com/iexperience', {
  method: 'POST',
  body: JSON.stringify({
    credentials: { token: 'sk_cliente', name: 'Cliente' },
    amount: 100,
    product: { title: 'Produto Teste' },
    customer: { /* dados */ }
  })
});

// RESULTADO: 100% cliente (regra 7x3 desativada)
```

## 🔍 **COMO OBTER O offerId**

### **1. VIA API (Listar ofertas):**

```bash
# Listar todas as ofertas
curl -X GET https://sua-api-pix.com/clients
```

```javascript
// Via JavaScript
const response = await fetch('https://sua-api-pix.com/clients');
const clients = await response.json();

// Encontrar oferta específica
const client = clients.find(c => c.name === 'Nome do Cliente');
const offer = client.offers.find(o => o.name === 'Nome da Oferta');
const offerId = offer.id;
```

### **2. VIA BANCO DE DADOS:**

```sql
-- Listar ofertas
SELECT id, name, "useTax", "clientId" 
FROM "Offer" 
ORDER BY "createdAt" DESC;

-- Encontrar oferta específica
SELECT id, name, "useTax" 
FROM "Offer" 
WHERE name = 'Nome da Oferta';
```

## ⚠️ **PONTOS IMPORTANTES**

### **1. useTax É POR OFERTA:**
- ✅ **Cada oferta** tem seu próprio `useTax`
- ✅ **Alterar uma oferta** não afeta outras
- ✅ **Controle granular** por produto

### **2. APENAS PARA CERTOS CONTROLADORES:**
- ✅ **`/iexperience`**: Usa `useTax`
- ✅ **`/lunarcash`**: Usa `useTax`
- ❌ **`/gerarpix`**: NÃO usa `useTax` (sempre 7x3)
- ❌ **`/gov`**: NÃO usa `useTax` (sempre Paulo)

### **3. VALIDAÇÃO:**
- ✅ **`offerId`** deve existir
- ✅ **`useTax`** deve ser `true` ou `false`
- ✅ **API retorna erro** se parâmetros inválidos

## 🚀 **EXEMPLOS COMPLETOS**

### **CENÁRIO 1: Ativar regra 7x3 para uma oferta**

```javascript
// 1. Listar ofertas para encontrar o ID
const clientsResponse = await fetch('https://sua-api-pix.com/clients');
const clients = await clientsResponse.json();

// 2. Encontrar oferta específica
const client = clients.find(c => c.name === 'João Silva');
const offer = client.offers.find(o => o.name === 'Produto A');
const offerId = offer.id;

// 3. Ativar useTax
const useTaxResponse = await fetch('https://sua-api-pix.com/use-tax', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    offerId: offerId,
    useTax: true
  })
});

const result = await useTaxResponse.json();
console.log('Regra 7x3 ativada:', result);
```

### **CENÁRIO 2: Desativar regra 7x3 para uma oferta**

```javascript
// 1. Desativar useTax
const useTaxResponse = await fetch('https://sua-api-pix.com/use-tax', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    offerId: 'uuid-da-oferta',
    useTax: false
  })
});

const result = await useTaxResponse.json();
console.log('Regra 7x3 desativada:', result);
```

### **CENÁRIO 3: Verificar status atual do useTax**

```javascript
// 1. Listar ofertas
const clientsResponse = await fetch('https://sua-api-pix.com/clients');
const clients = await clientsResponse.json();

// 2. Verificar status
const client = clients.find(c => c.name === 'João Silva');
const offer = client.offers.find(o => o.name === 'Produto A');

console.log('Status atual do useTax:', offer.useTax);
// true = regra 7x3 ativada
// false = regra 7x3 desativada
```

## 📋 **RESUMO EXECUTIVO**

### **PERGUNTA: "Qual rota devo usar para ligar e desligar o useTax?"**

### **RESPOSTA: `POST /use-tax`**

### **PARÂMETROS:**
- **`offerId`**: ID da oferta
- **`useTax`**: `true` (ligar) ou `false` (desligar)

### **EXEMPLO:**
```bash
curl -X POST https://sua-api-pix.com/use-tax \
  -H "Content-Type: application/json" \
  -d '{
    "offerId": "uuid-da-oferta",
    "useTax": true
  }'
```

### **RESULTADO:**
- **`useTax = true`**: 70% cliente, 30% Paulo (regra 7x3)
- **`useTax = false`**: 100% cliente (regra 7x3 desativada)

### **OBSERVAÇÕES:**
- ✅ **Funciona apenas** para `/iexperience` e `/lunarcash`
- ✅ **Não funciona** para `/gerarpix` (sempre 7x3)
- ✅ **Controle granular** por oferta

---

**Agora você sabe exatamente como usar a rota /use-tax! 🚀**

