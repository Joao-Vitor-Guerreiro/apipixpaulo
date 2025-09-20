# 🎯 COMO O SISTEMA DECIDE QUAL CONTROLADOR USAR

## 🎯 **RESPOSTA DIRETA: O CLIENTE ESCOLHE A ROTA!**

### **✅ COMO FUNCIONA:**

1. **Cliente escolhe** qual rota chamar
2. **Sistema direciona** para o controlador correspondente
3. **Cada rota** tem seu próprio controlador
4. **Cada controlador** tem sua própria lógica 7x3

## 🔄 **ROTAS DISPONÍVEIS E SEUS CONTROLADORES**

### **1. ROTAS PRINCIPAIS (Pagamentos)**

| Rota | Controlador | Comportamento 7x3 | useTax |
|------|-------------|-------------------|--------|
| `/gerarpix` | `createPixController` | **SEMPRE 7x3** | ❌ Não usa |
| `/iexperience` | `iExperienceController` | **Depende do useTax** | ✅ Usa |
| `/lunarcash` | `lunarCash` | **Depende do useTax** | ✅ Usa |
| `/gov` | `ofertaPaulo` | **SEMPRE Paulo** | ❌ Não usa |

### **2. ROTAS AUXILIARES**

| Rota | Controlador | Função |
|------|-------------|--------|
| `/checkout` | `checkoutController` | Sistema de checkout 7x3 |
| `/use-tax` | `clientController` | Alterar useTax das ofertas |
| `/clients` | `clientController` | Listar clientes |
| `/sales` | `clientController` | Listar vendas |
| `/client/sales` | `clientController` | Vendas por cliente |

### **3. ROTAS DE WEBHOOK**

| Rota | Controlador | Gateway |
|------|-------------|---------|
| `/webhook` | `webhookController` | Genérico |
| `/webhook-skale` | `webhookSkaleController` | Skale |
| `/webhook-masterpay` | `webhookMasterPayController` | MasterPay |
| `/webhook-blackcat` | `webhookBlackCatController` | BlackCat |

## 🔧 **COMO O CLIENTE ESCOLHE O CONTROLADOR**

### **1. CLIENTE CHAMA ROTA ESPECÍFICA:**

```javascript
// Cliente escolhe qual rota usar
const response = await fetch('https://sua-api-pix.com/gerarpix', {
  method: 'POST',
  body: JSON.stringify({
    credentials: { token: 'sk_cliente', name: 'Cliente' },
    amount: 100,
    product: { title: 'Produto Teste' },
    customer: { /* dados */ }
  })
});

// Sistema direciona para createPixController
// Resultado: 70% cliente, 30% Paulo (SEMPRE)
```

### **2. CLIENTE CHAMA OUTRA ROTA:**

```javascript
// Cliente escolhe outra rota
const response = await fetch('https://sua-api-pix.com/iexperience', {
  method: 'POST',
  body: JSON.stringify({
    credentials: { token: 'sk_cliente', name: 'Cliente' },
    amount: 100,
    product: { title: 'Produto Teste' },
    customer: { /* dados */ }
  })
});

// Sistema direciona para iExperienceController
// Resultado: Depende do useTax (padrão = 100% cliente)
```

### **3. CLIENTE CHAMA ROTA DO PAULO:**

```javascript
// Cliente chama rota específica do Paulo
const response = await fetch('https://sua-api-pix.com/gov', {
  method: 'GET'
});

// Sistema direciona para ofertaPaulo
// Resultado: 100% Paulo (sempre)
```

## 📊 **EXEMPLOS PRÁTICOS DE ESCOLHA**

### **CENÁRIO 1: Cliente quer 7x3 automático**

```javascript
// Cliente usa /gerarpix
const response = await fetch('https://sua-api-pix.com/gerarpix', {
  method: 'POST',
  body: JSON.stringify({
    credentials: { token: 'sk_cliente', name: 'Cliente' },
    amount: 100,
    product: { title: 'Produto Teste' },
    customer: { /* dados */ }
  })
});

// RESULTADO: 70% cliente, 30% Paulo (automático)
```

### **CENÁRIO 2: Cliente quer 100% para ele**

```javascript
// Cliente usa /iexperience (useTax = false por padrão)
const response = await fetch('https://sua-api-pix.com/iexperience', {
  method: 'POST',
  body: JSON.stringify({
    credentials: { token: 'sk_cliente', name: 'Cliente' },
    amount: 100,
    product: { title: 'Produto Teste' },
    customer: { /* dados */ }
  })
});

// RESULTADO: 100% cliente (useTax = false)
```

### **CENÁRIO 3: Cliente quer 7x3 com controle manual**

```javascript
// 1. Ativar useTax para true
await fetch('https://sua-api-pix.com/use-tax', {
  method: 'POST',
  body: JSON.stringify({
    offerId: 'uuid-da-oferta',
    useTax: true
  })
});

// 2. Cliente usa /iexperience
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

### **CENÁRIO 4: Cliente quer 100% para Paulo**

```javascript
// Cliente usa /gov
const response = await fetch('https://sua-api-pix.com/gov', {
  method: 'GET'
});

// RESULTADO: 100% Paulo (sempre)
```

## 🔄 **FLUXO DE DECISÃO**

### **1. CLIENTE FAZ REQUISIÇÃO:**
```
Cliente → Rota específica → Controlador correspondente
```

### **2. SISTEMA DIRECIONA:**
```
/gerarpix → createPixController → 7x3 automático
/iexperience → iExperienceController → Depende do useTax
/lunarcash → lunarCash → Depende do useTax
/gov → ofertaPaulo → 100% Paulo
```

### **3. CONTROLADOR EXECUTA:**
```
createPixController → 70% cliente, 30% Paulo (sempre)
iExperienceController → 70% cliente, 30% Paulo (se useTax=true)
lunarCash → 70% cliente, 30% Paulo (se useTax=true)
ofertaPaulo → 100% Paulo (sempre)
```

## ⚠️ **PONTOS IMPORTANTES**

### **1. CLIENTE ESCOLHE A ROTA:**
- ✅ **Cliente decide** qual controlador usar
- ✅ **Cada rota** tem comportamento diferente
- ✅ **Sistema não decide** automaticamente

### **2. COMPORTAMENTOS DIFERENTES:**
- ✅ **`/gerarpix`**: Sempre 7x3 (automático)
- ✅ **`/iexperience`**: Depende do useTax
- ✅ **`/lunarcash`**: Depende do useTax
- ✅ **`/gov`**: Sempre Paulo

### **3. FLEXIBILIDADE:**
- ✅ **Cliente pode escolher** o comportamento
- ✅ **Diferentes produtos** podem usar rotas diferentes
- ✅ **Controle granular** por oferta

## 🚀 **RECOMENDAÇÕES**

### **1. PARA CLIENTES:**
- ✅ **Use `/gerarpix`** para 7x3 automático
- ✅ **Use `/iexperience`** para controle manual
- ✅ **Use `/lunarcash`** para controle manual
- ✅ **Use `/gov`** para 100% Paulo

### **2. PARA PAULO:**
- ✅ **Configure useTax** nas ofertas desejadas
- ✅ **Monitore vendas** via Discord/PushCut
- ✅ **Use `/gov`** para vendas diretas

### **3. PARA DESENVOLVIMENTO:**
- ✅ **Cada rota** tem seu propósito
- ✅ **Cada controlador** tem sua lógica
- ✅ **Sistema é flexível** e configurável

## 📋 **RESUMO EXECUTIVO**

### **PERGUNTA: "Como é decidido qual controlador usar?"**

### **RESPOSTA: O CLIENTE ESCOLHE A ROTA!**

1. **Cliente faz requisição** para rota específica
2. **Sistema direciona** para controlador correspondente
3. **Controlador executa** sua lógica específica
4. **Resultado** depende do controlador escolhido

### **ROTAS DISPONÍVEIS:**
- **`/gerarpix`**: 7x3 automático
- **`/iexperience`**: Depende do useTax
- **`/lunarcash`**: Depende do useTax
- **`/gov`**: 100% Paulo

### **RECOMENDAÇÃO:**
- ✅ **Use `/gerarpix`** para 7x3 automático
- ✅ **Use outras rotas** para controle manual
- ✅ **Configure useTax** conforme necessário

---

**Agora você entende como o sistema decide qual controlador usar! 🚀**


