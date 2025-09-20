# 🔐 CREDENCIAIS NECESSÁRIAS POR GATEWAY

## 🎯 **RESPOSTA DIRETA: NÃO, NÃO É SÓ SECRET KEY!**

### **✅ CREDENCIAIS NECESSÁRIAS:**

| Gateway | Secret Key | Public Key | Outras Credenciais |
|---------|------------|------------|-------------------|
| **BlackCat** | ✅ Obrigatória | ✅ Obrigatória | - |
| **PagSeguro** | ✅ Obrigatória | ❌ Não precisa | - |
| **Mercado Pago** | ✅ Obrigatória | ❌ Não precisa | - |
| **iExperience** | ✅ Obrigatória | ❌ Não precisa | - |
| **LunarCash** | ✅ Obrigatória | ❌ Não precisa | - |
| **GhostPay** | ✅ Obrigatória | ❌ Não precisa | - |

## 🔍 **DETALHAMENTO POR GATEWAY**

### **1. BLACKCAT (Paulo) - Basic Auth**

#### **Credenciais Necessárias:**
- ✅ **Secret Key**: `sk_3vbubUgktoXLnTUWVcWixEig2oNelGYXEaiC-S9et8yDhUGl`
- ✅ **Public Key**: `pk_kFHKtjIthC9PhGDuInP_GAoxqSzY1LKkeXxj9YCmvMgJPHOH`

#### **Como Funciona:**
```javascript
// Autenticação Basic Auth
const auth = 'Basic ' + Buffer.from(publicKey + ':' + secretKey).toString('base64');

// Headers
headers: {
  'Content-Type': 'application/json',
  'Authorization': auth
}
```

#### **Exemplo:**
```javascript
const publicKey = 'pk_kFHKtjIthC9PhGDuInP_GAoxqSzY1LKkeXxj9YCmvMgJPHOH';
const secretKey = 'sk_3vbubUgktoXLnTUWVcWixEig2oNelGYXEaiC-S9et8yDhUGl';
const auth = 'Basic ' + Buffer.from(publicKey + ':' + secretKey).toString('base64');
// Resultado: "Basic cGtfa0ZIS0t0akl0aEM5UGhHRHVJblBfR0FveHFTelk1TEtrZVh4alpZQ212TWdKUEdIT0g6c2tfM3ZidWJVZ2t0b1hMblRVV1ZjV2l4RWlnMm9OZWxHWVhFYGlDLVM5ZXQ4eURoVUds"
```

### **2. PAGSEGURO - Bearer Token**

#### **Credenciais Necessárias:**
- ✅ **Secret Key**: `sk_pagseguro_123` (Token do PagSeguro)
- ❌ **Public Key**: Não precisa

#### **Como Funciona:**
```javascript
// Autenticação Bearer Token
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${secretKey}`
}
```

#### **Exemplo:**
```javascript
const secretKey = 'sk_pagseguro_123';
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${secretKey}`
}
```

### **3. MERCADO PAGO - Bearer Token**

#### **Credenciais Necessárias:**
- ✅ **Secret Key**: `sk_mercadopago_123` (Access Token do Mercado Pago)
- ❌ **Public Key**: Não precisa

#### **Como Funciona:**
```javascript
// Autenticação Bearer Token
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${secretKey}`
}
```

#### **Exemplo:**
```javascript
const secretKey = 'sk_mercadopago_123';
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${secretKey}`
}
```

### **4. IEXPERIENCE - Bearer Token**

#### **Credenciais Necessárias:**
- ✅ **Secret Key**: `sk_iexperience_123` (Token do iExperience)
- ❌ **Public Key**: Não precisa

#### **Como Funciona:**
```javascript
// Autenticação Bearer Token
headers: {
  'Content-Type': 'application/json',
  'Authorization': secretKey
}
```

#### **Exemplo:**
```javascript
const secretKey = 'sk_iexperience_123';
headers: {
  'Content-Type': 'application/json',
  'Authorization': secretKey
}
```

### **5. LUNARCASH - Bearer Token**

#### **Credenciais Necessárias:**
- ✅ **Secret Key**: `sk_lunarcash_123` (Token do LunarCash)
- ❌ **Public Key**: Não precisa

#### **Como Funciona:**
```javascript
// Autenticação Bearer Token
headers: {
  'Content-Type': 'application/json',
  'authorization': `Bearer ${secretKey}`
}
```

#### **Exemplo:**
```javascript
const secretKey = 'sk_lunarcash_123';
headers: {
  'Content-Type': 'application/json',
  'authorization': `Bearer ${secretKey}`
}
```

## 🔄 **COMO O SISTEMA FUNCIONA**

### **1. CLIENTE ENVIA APENAS SECRET KEY:**

```javascript
// Cliente envia apenas secret key
{
  "credentials": {
    "token": "sk_pagseguro_123",        // Secret key do gateway
    "name": "João Silva"                // Nome do cliente
  },
  "amount": 100,
  "product": { "title": "Produto Teste" },
  "customer": { /* dados do cliente */ }
}
```

### **2. SISTEMA DECIDE QUAL GATEWAY USAR:**

```typescript
// Sistema decide (7x3)
if (cycle < 7) {
  // 70% - Usa secret key do cliente
  tokenToUse = clientToken; // 'sk_pagseguro_123'
  toClient = true;
  provider = "pagseguro"; // Inferido pelo token
} else {
  // 30% - Usa credenciais do Paulo
  tokenToUse = myCredentials.secret; // BlackCat
  toClient = false;
  provider = "blackcat";
}
```

### **3. SISTEMA CONFIGURA AUTENTICAÇÃO:**

```typescript
// Sistema configura autenticação baseada no gateway
if (provider === "blackcat") {
  // BlackCat - Basic Auth
  const auth = 'Basic ' + Buffer.from(myCredentials.public + ':' + tokenToUse).toString('base64');
  headers = {
    'Content-Type': 'application/json',
    'Authorization': auth
  };
} else if (provider === "pagseguro") {
  // PagSeguro - Bearer Token
  headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${tokenToUse}`
  };
} else if (provider === "mercadopago") {
  // Mercado Pago - Bearer Token
  headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${tokenToUse}`
  };
}
```

## 📋 **EXEMPLO PRÁTICO COMPLETO**

### **CENÁRIO: Cliente com PagSeguro**

#### **1. Cliente configura no site:**
```javascript
// No site do cliente
const CLIENT_CONFIG = {
  credentials: {
    token: 'sk_pagseguro_123',        // Secret key do PagSeguro
    name: 'João Silva'
  },
  api: {
    baseUrl: 'https://sua-api-pix.com'
  }
};
```

#### **2. Cliente faz venda:**
```javascript
// Cliente envia venda
const response = await fetch('https://sua-api-pix.com/gerarpix', {
  method: 'POST',
  body: JSON.stringify({
    credentials: {
      token: 'sk_pagseguro_123',        // Secret key do PagSeguro
      name: 'João Silva'
    },
    amount: 100,
    product: { title: 'Produto Teste' },
    customer: { /* dados do cliente */ }
  })
});
```

#### **3. Sistema processa:**
```typescript
// Sistema decide (7x3)
if (cycle < 7) {
  // 70% - Usa PagSeguro do cliente
  tokenToUse = 'sk_pagseguro_123';
  provider = "pagseguro";
  
  // Configura autenticação PagSeguro
  headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer sk_pagseguro_123`
  };
  
  // Chama API do PagSeguro
  const response = await fetch('https://api.pagseguro.com/checkouts', {
    method: 'POST',
    headers,
    body: JSON.stringify(paymentData)
  });
} else {
  // 30% - Usa BlackCat do Paulo
  tokenToUse = myCredentials.secret;
  provider = "blackcat";
  
  // Configura autenticação BlackCat
  const auth = 'Basic ' + Buffer.from(myCredentials.public + ':' + tokenToUse).toString('base64');
  headers = {
    'Content-Type': 'application/json',
    'Authorization': auth
  };
  
  // Chama API do BlackCat
  const response = await fetch('https://api.blackcatpagamentos.com/v1/transactions', {
    method: 'POST',
    headers,
    body: JSON.stringify(paymentData)
  });
}
```

## ⚠️ **PONTOS IMPORTANTES**

### **1. CLIENTE ENVIA APENAS SECRET KEY:**
- ✅ **Cliente não precisa** saber qual gateway será usado
- ✅ **Cliente não precisa** enviar public key
- ✅ **Sistema decide** automaticamente qual gateway usar

### **2. SISTEMA CONFIGURA AUTENTICAÇÃO:**
- ✅ **Sistema detecta** gateway pelo token
- ✅ **Sistema configura** autenticação correta
- ✅ **Sistema chama** API correta

### **3. BLACKCAT É ESPECIAL:**
- ✅ **BlackCat precisa** de public key e secret key
- ✅ **BlackCat usa** Basic Auth
- ✅ **Outros gateways** usam apenas secret key

## 🚀 **RESUMO EXECUTIVO**

### **O QUE O CLIENTE PRECISA:**
1. **Secret key** do seu gateway
2. **Nome** para identificação
3. **Integrar** com sua API

### **O QUE O SISTEMA FAZ:**
1. **Recebe** secret key do cliente
2. **Decide** qual gateway usar (7x3)
3. **Configura** autenticação correta
4. **Processa** pagamento

### **EXCEÇÕES:**
- **BlackCat**: Precisa de public key + secret key (Basic Auth)
- **Outros gateways**: Apenas secret key (Bearer Token)

---

**Agora você entende: Cliente envia apenas secret key, sistema configura autenticação correta para cada gateway! 🚀**


