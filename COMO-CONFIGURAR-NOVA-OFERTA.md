# 🚀 COMO CONFIGURAR UMA NOVA OFERTA

## 🎯 **RESPOSTA DIRETA À SUA PERGUNTA**

### **✅ ROTAS PARA CONFIGURAR NOVA OFERTA:**

1. **Checkout**: `POST /checkout/update` (configurar checkout do Paulo)
2. **useTax**: `POST /use-tax` (ativar/desativar regra 7x3)
3. **Cliente**: Criado automaticamente na primeira venda

### **✅ ROTA RECOMENDADA PARA VENDAS:**

- **`/gerarpix`**: Sempre 7x3 (automático)
- **`/iexperience`**: Depende do useTax (controle manual)
- **`/lunarcash`**: Depende do useTax (controle manual)

## 🔧 **PASSO A PASSO COMPLETO**

### **1. CONFIGURAR CHECKOUT DO PAULO**

```bash
# Configurar checkout para sua nova oferta
curl -X POST https://sua-api-pix.com/checkout/update \
  -H "Content-Type: application/json" \
  -d '{
    "checkout": "https://checkout-paulo.com/nova-oferta",
    "offer": "Nova Oferta"
  }'
```

```javascript
// Via JavaScript
const response = await fetch('https://sua-api-pix.com/checkout/update', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    checkout: 'https://checkout-paulo.com/nova-oferta',
    offer: 'Nova Oferta'
  })
});

console.log('Checkout configurado:', await response.json());
```

### **2. CLIENTE FAZ PRIMEIRA VENDA (CRIA OFERTA AUTOMATICAMENTE)**

```javascript
// Cliente integra com sua API
const response = await fetch('https://sua-api-pix.com/gerarpix', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    credentials: {
      token: 'sk_cliente_123',        // Secret key do cliente
      name: 'Nome do Cliente'         // Nome do cliente
    },
    amount: 100,
    product: {
      title: 'Nova Oferta'            // Nome da oferta
    },
    customer: {
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '11999999999',
      document: {
        type: 'CPF',
        number: '12345678901'
      }
    }
  })
});
```

### **3. CONFIGURAR useTax (PARA RECEBER VENDAS)**

```bash
# 1. Obter ID da oferta
curl -X GET https://sua-api-pix.com/clients

# 2. Ativar useTax para true
curl -X POST https://sua-api-pix.com/use-tax \
  -H "Content-Type: application/json" \
  -d '{
    "offerId": "uuid-da-oferta",
    "useTax": true
  }'
```

```javascript
// Via JavaScript
// 1. Listar ofertas para encontrar o ID
const clientsResponse = await fetch('https://sua-api-pix.com/clients');
const clients = await clientsResponse.json();

// 2. Encontrar oferta específica
const client = clients.find(c => c.name === 'Nome do Cliente');
const offer = client.offers.find(o => o.name === 'Nova Oferta');
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

console.log('useTax ativado:', await useTaxResponse.json());
```

## 🔄 **SISTEMA DE CHECKOUT 7x3**

### **COMO FUNCIONA:**

1. **Cliente chama** `/checkout` com nome da oferta
2. **Sistema decide** qual checkout usar (7x3)
3. **70% das vezes** → Checkout do cliente
4. **30% das vezes** → Checkout do Paulo

### **EXEMPLO DE USO:**

```javascript
// Cliente chama checkout
const checkoutResponse = await fetch('https://sua-api-pix.com/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    checkout: 'https://checkout-cliente.com/nova-oferta',
    offer: 'Nova Oferta'
  })
});

const { checkout } = await checkoutResponse.json();
console.log('Checkout a usar:', checkout);
// Resultado: 70% cliente, 30% Paulo
```

## 📊 **COMPORTAMENTO POR ROTA**

### **1. `/gerarpix` (RECOMENDADO):**

```javascript
// Cliente usa /gerarpix
const response = await fetch('https://sua-api-pix.com/gerarpix', {
  method: 'POST',
  body: JSON.stringify({
    credentials: { token: 'sk_cliente', name: 'Cliente' },
    amount: 100,
    product: { title: 'Nova Oferta' },
    customer: { /* dados */ }
  })
});

// RESULTADO: 70% cliente, 30% Paulo (SEMPRE)
// NÃO precisa configurar useTax
```

### **2. `/iexperience` (CONTROLE MANUAL):**

```javascript
// Cliente usa /iexperience
const response = await fetch('https://sua-api-pix.com/iexperience', {
  method: 'POST',
  body: JSON.stringify({
    credentials: { token: 'sk_cliente', name: 'Cliente' },
    amount: 100,
    product: { title: 'Nova Oferta' },
    customer: { /* dados */ }
  })
});

// RESULTADO: Depende do useTax
// useTax = false (padrão): 100% cliente
// useTax = true (manual): 70% cliente, 30% Paulo
```

### **3. `/lunarcash` (CONTROLE MANUAL):**

```javascript
// Cliente usa /lunarcash
const response = await fetch('https://sua-api-pix.com/lunarcash', {
  method: 'POST',
  body: JSON.stringify({
    credentials: { token: 'sk_cliente', name: 'Cliente' },
    amount: 100,
    product: { title: 'Nova Oferta' },
    customer: { /* dados */ }
  })
});

// RESULTADO: Depende do useTax
// useTax = false (padrão): 100% cliente
// useTax = true (manual): 70% cliente, 30% Paulo
```

## ⚠️ **PONTOS IMPORTANTES**

### **1. CHECKOUT É OBRIGATÓRIO:**
- ✅ **Configure checkout** antes da primeira venda
- ✅ **Sistema 7x3** funciona para checkout
- ✅ **Cliente recebe** checkout correto

### **2. useTax É POR OFERTA:**
- ✅ **Cada oferta** tem seu próprio useTax
- ✅ **Alterar uma oferta** não afeta outras
- ✅ **Controle granular** por produto

### **3. CLIENTE É CRIADO AUTOMATICAMENTE:**
- ✅ **Primeira venda** cria cliente
- ✅ **Credenciais** são armazenadas automaticamente
- ✅ **Oferta** é criada automaticamente

## 🚀 **EXEMPLO COMPLETO**

### **CENÁRIO: Nova oferta "Curso de Marketing"**

#### **1. Configurar checkout do Paulo:**

```bash
curl -X POST https://sua-api-pix.com/checkout/update \
  -H "Content-Type: application/json" \
  -d '{
    "checkout": "https://checkout-paulo.com/curso-marketing",
    "offer": "Curso de Marketing"
  }'
```

#### **2. Cliente faz primeira venda:**

```javascript
const response = await fetch('https://sua-api-pix.com/gerarpix', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    credentials: {
      token: 'sk_blackcat_cliente_123',
      name: 'João Silva'
    },
    amount: 297,
    product: {
      title: 'Curso de Marketing'
    },
    customer: {
      name: 'Maria Santos',
      email: 'maria@email.com',
      phone: '11999999999',
      document: {
        type: 'CPF',
        number: '12345678901'
      }
    }
  })
});
```

#### **3. Ativar useTax (se usar /iexperience ou /lunarcash):**

```bash
# Obter ID da oferta
curl -X GET https://sua-api-pix.com/clients

# Ativar useTax
curl -X POST https://sua-api-pix.com/use-tax \
  -H "Content-Type: application/json" \
  -d '{
    "offerId": "uuid-do-curso-marketing",
    "useTax": true
  }'
```

## 📋 **RESUMO EXECUTIVO**

### **PERGUNTA: "Como devo deixar no checkout? Devo usar qual rota?"**

### **RESPOSTA:**

#### **1. CHECKOUT:**
- **Rota**: `POST /checkout/update`
- **Função**: Configurar checkout do Paulo
- **Obrigatório**: Sim, antes da primeira venda

#### **2. VENDAS:**
- **`/gerarpix`**: 7x3 automático (recomendado)
- **`/iexperience`**: Depende do useTax
- **`/lunarcash`**: Depende do useTax

#### **3. useTax:**
- **Rota**: `POST /use-tax`
- **Função**: Ativar/desativar regra 7x3
- **Necessário**: Apenas para `/iexperience` e `/lunarcash`

### **RECOMENDAÇÃO:**
- ✅ **Use `/gerarpix`** para 7x3 automático
- ✅ **Configure checkout** antes da primeira venda
- ✅ **Configure useTax** apenas se usar outras rotas

---

**Agora você sabe exatamente como configurar uma nova oferta! 🚀**


