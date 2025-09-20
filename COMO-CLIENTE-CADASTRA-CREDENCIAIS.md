# 🔐 COMO O CLIENTE CADASTRA SUAS CREDENCIAIS

## 🎯 **RESPOSTA DIRETA: NÃO HÁ CADASTRO MANUAL!**

### **❌ O QUE NÃO EXISTE:**
- ❌ **Não há** formulário de cadastro
- ❌ **Não há** painel para o cliente cadastrar credenciais
- ❌ **Não há** banco de dados de credenciais pré-cadastradas

### **✅ O QUE REALMENTE ACONTECE:**
- ✅ **Cliente envia** credenciais a cada requisição
- ✅ **Sistema cria** cliente automaticamente na primeira venda
- ✅ **Credenciais são salvas** no banco automaticamente

## 🔄 **FLUXO REAL DE FUNCIONAMENTO**

### **1. CLIENTE FAZ REQUISIÇÃO COM SUAS CREDENCIAIS:**

```javascript
// Cliente envia credenciais a cada venda
const response = await fetch('https://sua-api-pix.com/gerarpix', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    credentials: {
      token: 'sk_pagseguro_123',     // Secret key do PagSeguro do cliente
      name: 'João Silva'             // Nome do cliente
    },
    amount: 100,
    product: { title: 'Produto Teste' },
    customer: { /* dados do cliente */ }
  })
});
```

### **2. SISTEMA VERIFICA SE CLIENTE EXISTE:**

```typescript
// Sistema busca cliente pelo token
let client = await prisma.client.findUnique({
  where: { token: clientToken }, // 'sk_pagseguro_123'
});

if (!client) {
  // Se não existir, cria automaticamente
  client = await prisma.client.create({
    data: {
      name: 'João Silva',           // Nome enviado pelo cliente
      token: 'sk_pagseguro_123',    // Token enviado pelo cliente
      useTax: false,                // Padrão: false
    },
  });
}
```

### **3. SISTEMA USA AS CREDENCIAIS PARA PROCESSAR PAGAMENTO:**

```typescript
// Sistema decide qual token usar (7x3)
if (cycle < 7) {
  // 70% - Usa credenciais do cliente
  tokenToUse = clientToken; // 'sk_pagseguro_123'
  toClient = true;
} else {
  // 30% - Usa credenciais do Paulo
  tokenToUse = myCredentials.secret; // BlackCat
  toClient = false;
}
```

## 📋 **EXEMPLO PRÁTICO COMPLETO**

### **CENÁRIO: Cliente "João Silva" com PagSeguro**

#### **1. Primeira Venda (Cliente não existe):**

```javascript
// Cliente faz primeira venda
const response = await fetch('https://sua-api-pix.com/gerarpix', {
  method: 'POST',
  body: JSON.stringify({
    credentials: {
      token: 'sk_pagseguro_joao_123',  // Secret key do PagSeguro
      name: 'João Silva'                // Nome do cliente
    },
    amount: 100,
    product: { title: 'Curso de Marketing' },
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

#### **2. Sistema Cria Cliente Automaticamente:**

```sql
-- Cliente é criado automaticamente
INSERT INTO "Client" VALUES (
  'uuid-123',
  'João Silva',                    -- Nome enviado pelo cliente
  NULL,
  'sk_pagseguro_joao_123',        -- Token enviado pelo cliente
  false,                          -- useTax padrão
  NOW()
);
```

#### **3. Sistema Processa Pagamento:**

```typescript
// Sistema decide (7x3)
const cycle = 1 % 10; // = 1

if (cycle < 7) {
  // 70% - Usa credenciais do João
  tokenToUse = 'sk_pagseguro_joao_123';
  toClient = true;
} else {
  // 30% - Usa credenciais do Paulo
  tokenToUse = 'sk_3vbubUgktoXLnTUWVcWixEig2oNelGYXEaiC-S9et8yDhUGl';
  toClient = false;
}
```

#### **4. Segunda Venda (Cliente já existe):**

```javascript
// Cliente faz segunda venda
const response = await fetch('https://sua-api-pix.com/gerarpix', {
  method: 'POST',
  body: JSON.stringify({
    credentials: {
      token: 'sk_pagseguro_joao_123',  // Mesmo token
      name: 'João Silva'                // Mesmo nome
    },
    // ... outros dados
  })
});
```

```typescript
// Sistema busca cliente existente
let client = await prisma.client.findUnique({
  where: { token: 'sk_pagseguro_joao_123' },
});

// Cliente já existe, não cria novo
// Usa credenciais existentes
```

## 🔧 **COMO O CLIENTE DEVE CONFIGURAR**

### **1. NO SITE DO CLIENTE:**

```javascript
// Configuração no site do cliente
const CLIENT_CONFIG = {
  credentials: {
    token: 'sk_pagseguro_123',        // Secret key do PagSeguro
    name: 'João Silva'                 // Nome do cliente
  },
  api: {
    baseUrl: 'https://sua-api-pix.com'
  }
};

// Função para processar venda
async function processarVenda(dadosVenda) {
  const response = await fetch(`${CLIENT_CONFIG.api.baseUrl}/gerarpix`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      credentials: CLIENT_CONFIG.credentials, // Envia credenciais
      amount: dadosVenda.valor,
      product: { title: dadosVenda.produto },
      customer: dadosVenda.cliente
    })
  });
  
  return await response.json();
}
```

### **2. EXEMPLO DE INTEGRAÇÃO COMPLETA:**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Loja do Cliente</title>
</head>
<body>
    <div class="produto">
        <h2>Curso de Marketing</h2>
        <p>R$ 297,00</p>
        <button onclick="comprar()">Comprar Agora</button>
    </div>

    <script>
        // Configuração do cliente
        const CLIENT_CONFIG = {
            credentials: {
                token: 'sk_pagseguro_123',  // Secret key do PagSeguro
                name: 'João Silva'           // Nome do cliente
            },
            api: {
                baseUrl: 'https://sua-api-pix.com'
            }
        };

        async function comprar() {
            try {
                // Processar venda
                const response = await fetch(`${CLIENT_CONFIG.api.baseUrl}/gerarpix`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        credentials: CLIENT_CONFIG.credentials,
                        amount: 297,
                        product: { title: 'Curso de Marketing' },
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
                
                const pixData = await response.json();
                window.location.href = pixData.payment_url;
                
            } catch (error) {
                console.error('Erro ao processar venda:', error);
                alert('Erro ao processar venda. Tente novamente.');
            }
        }
    </script>
</body>
</html>
```

## ⚠️ **PONTOS IMPORTANTES**

### **1. CREDENCIAIS SÃO ENVIADAS A CADA VENDA:**
- ✅ **Não há** cadastro prévio
- ✅ **Cliente envia** credenciais a cada requisição
- ✅ **Sistema cria** cliente automaticamente

### **2. SEGURANÇA:**
- ✅ **Token é único** por cliente
- ✅ **Sistema valida** credenciais antes de usar
- ✅ **Credenciais são salvas** no banco de dados

### **3. SISTEMA 7x3:**
- ✅ **70%** das vendas usam credenciais do cliente
- ✅ **30%** das vendas usam credenciais do Paulo
- ✅ **Decisão automática** baseada na contagem

## 🚀 **RESUMO EXECUTIVO**

### **COMO FUNCIONA:**
1. **Cliente configura** credenciais no seu site
2. **Cliente envia** credenciais a cada venda
3. **Sistema cria** cliente automaticamente
4. **Sistema usa** credenciais conforme regra 7x3

### **O QUE O CLIENTE PRECISA FAZER:**
1. **Obter credenciais** do seu gateway (PagSeguro, Mercado Pago, etc.)
2. **Configurar** no seu site
3. **Enviar** a cada requisição para sua API

### **O QUE VOCÊ (PAULO) PRECISA FAZER:**
1. **Configurar checkout** para a oferta
2. **Configurar useTax = true** para receber vendas
3. **Monitorar** vendas via Discord/PushCut

---

**Agora você entende: NÃO HÁ CADASTRO MANUAL! O cliente envia credenciais a cada venda e o sistema cria tudo automaticamente! 🚀**

