# 🚀 GUIA COMPLETO: CONFIGURAR NOVA OFERTA

## 📋 **Visão Geral**

Este guia mostra como configurar uma nova oferta do zero, incluindo checkout, primeira venda, e configuração do `useTax`.

---

## 🎯 **ETAPA 1: CONFIGURAR CHECKOUT NO SITE DO CLIENTE**

### **1.1 - Modificar o `page.tsx` do checkout:**

```typescript
// page.tsx (exemplo)
import { useState } from 'react';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    
    try {
      // 1️⃣ Chamar API de checkout
      const response = await fetch('https://sua-api.com/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkout: 'https://seu-checkout.com/pagamento', // URL do seu checkout
          offer: 'Nome da Nova Oferta' // Nome da oferta
        })
      });

      const data = await response.json();
      
      // 2️⃣ Redirecionar para o checkout retornado
      if (data.checkout) {
        window.location.href = data.checkout;
      }
      
    } catch (error) {
      console.error('Erro no checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Nova Oferta - Checkout</h1>
      <button 
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? 'Processando...' : 'Finalizar Compra'}
      </button>
    </div>
  );
}
```

### **1.2 - Configurar a URL da API:**
- Substitua `https://sua-api.com` pela URL real da sua API
- Substitua `https://seu-checkout.com/pagamento` pela URL real do seu checkout

---

## 🛒 **ETAPA 2: FAZER PRIMEIRA VENDA (CRIA OFERTA AUTOMATICAMENTE)**

### **2.1 - Estrutura da requisição:**

```typescript
// Exemplo de requisição para /iexperience
const vendaData = {
  credentials: {
    token: "sk_cliente_123456789", // Secret key do cliente
    publicKey: "pk_cliente_987654321", // Public key do cliente
    name: "Nome do Cliente",
    offer: {
      id: "oferta-001", // ID único da oferta
      name: "Nome da Nova Oferta" // Nome da oferta
    }
  },
  amount: 97.00, // Valor da venda
  product: {
    title: "Produto da Nova Oferta"
  },
  customer: {
    phone: "11999999999",
    name: "João Silva",
    email: "joao@email.com",
    document: {
      type: "CPF",
      number: "12345678901"
    }
  }
};
```

### **2.2 - Fazer a requisição:**

```bash
curl -X POST https://sua-api.com/iexperience \
  -H "Content-Type: application/json" \
  -d '{
    "credentials": {
      "token": "sk_cliente_123456789",
      "publicKey": "pk_cliente_987654321",
      "name": "Nome do Cliente",
      "offer": {
        "id": "oferta-001",
        "name": "Nome da Nova Oferta"
      }
    },
    "amount": 97.00,
    "product": {
      "title": "Produto da Nova Oferta"
    },
    "customer": {
      "phone": "11999999999",
      "name": "João Silva",
      "email": "joao@email.com",
      "document": {
        "type": "CPF",
        "number": "12345678901"
      }
    }
  }'
```

### **2.3 - O que acontece automaticamente:**
- ✅ **Cliente** é criado no banco (se não existir)
- ✅ **Oferta** é criada no banco com `useTax: false`
- ✅ **Venda** é salva no banco
- ✅ **Gateway** usado: BlackCat do cliente (100% para cliente)

---

## ⚙️ **ETAPA 3: CONFIGURAR USETAX (OPCIONAL)**

### **3.1 - Verificar se a oferta foi criada:**

```bash
# Listar ofertas
curl -X GET https://sua-api.com/clients
```

### **3.2 - Ativar regra 7x3 (se desejado):**

```bash
# Ativar useTax para a oferta
curl -X POST https://sua-api.com/use-tax \
  -H "Content-Type: application/json" \
  -d '{
    "offerId": "id-da-oferta-criada",
    "useTax": true
  }'
```

### **3.3 - Desativar regra 7x3 (se necessário):**

```bash
# Desativar useTax para a oferta
curl -X POST https://sua-api.com/use-tax \
  -H "Content-Type: application/json" \
  -d '{
    "offerId": "id-da-oferta-criada",
    "useTax": false
  }'
```

---

## 🧪 **ETAPA 4: TESTAR O FLUXO COMPLETO**

### **4.1 - Teste com useTax = false (padrão):**
```bash
# Fazer 10 vendas e verificar logs
# Todas devem ir para o cliente (100%)
```

### **4.2 - Teste com useTax = true:**
```bash
# Fazer 10 vendas e verificar logs
# Vendas 1-6: Cliente (70%)
# Vendas 7-9: Paulo (30%)
# Venda 10: Cliente
```

### **4.3 - Verificar logs:**
```
🔁 Requisição #1 | API usada: BLACKCAT-CLIENT | Enviado para: CLIENTE (BLACKCAT)
🔁 Requisição #8 | API usada: BLACKCAT-PAULO | Enviado para: VOCÊ (BLACKCAT)
```

---

## 📊 **ETAPA 5: MONITORAMENTO**

### **5.1 - Verificar vendas:**
```bash
# Listar todas as vendas
curl -X GET https://sua-api.com/sales

# Listar vendas de um cliente específico
curl -X GET https://sua-api.com/client/sales \
  -H "Content-Type: application/json" \
  -d '{"clientId": "id-do-cliente"}'
```

### **5.2 - Verificar ofertas:**
```bash
# Listar ofertas
curl -X GET https://sua-api.com/clients
```

---

## 🎯 **RESUMO DO PROCESSO**

| Etapa | Ação | Resultado |
|-------|------|-----------|
| **1** | Configurar checkout no `page.tsx` | Checkout funcional |
| **2** | Fazer primeira venda | Oferta criada automaticamente |
| **3** | Configurar `useTax` (opcional) | Regra 7x3 ativada/desativada |
| **4** | Testar vendas seguintes | Fluxo validado |
| **5** | Monitorar resultados | Sistema funcionando |

---

## ⚠️ **IMPORTANTE**

### **Credenciais do Cliente:**
- O cliente **DEVE** enviar `publicKey` e `token` (secret key)
- Se não enviar `publicKey`, será usado o do Paulo
- BlackCat usa Basic Auth: `public:secret`

### **Nomes das Ofertas:**
- Use nomes únicos para cada oferta
- O sistema diferencia ofertas pelo nome + cliente
- Exemplo: "Oferta Ebook", "Oferta Curso", etc.

### **Logs:**
- Monitore os logs para verificar se está funcionando
- `BLACKCAT-CLIENT` = Cliente
- `BLACKCAT-PAULO` = Paulo

---

## 🚀 **PRÓXIMOS PASSOS**

1. **Configure** o checkout no `page.tsx`
2. **Faça** a primeira venda
3. **Verifique** se a oferta foi criada
4. **Configure** `useTax` se necessário
5. **Teste** o fluxo completo
6. **Monitore** os resultados

**Sua nova oferta estará funcionando perfeitamente!** 🎉

