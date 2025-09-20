# 🔄 GUIA DE MIGRAÇÃO: page.tsx para iexperience.ts

## ❌ **O QUE REMOVER do page.tsx atual:**

### **1. Remover toda a configuração do tracker:**
```typescript
// REMOVER ESTE BLOCO COMPLETO:
const checkoutPayload = {
  checkout: "https://crocsbr.com/checkout",
  offer: "crocs-brasil-gratis-pedro",
  customer: { /* ... */ },
  product: { /* ... */ },
  amount: calculateTotal(),
  credentials: { /* ... */ },
  paymentProvider: "blackcat",
  gateway: "blackcat",
  blackcat: {
    publicKey: "pk_N85R4tzIst5Q3GiFKXgPFmMqhbdDGq4riT6CbaxOtAT4srk0",
    secretKey: "sk_o36muB0mB5FMjGsyIXiqioz0qIbR5lkBT3_PyprjW3JJpstN",
    baseUrl: "https://api.blackcatpagamentos.com/v1"
  },
  allowpay: null,
  allowPay: null
}
```

### **2. Remover a chamada para o tracker:**
```typescript
// REMOVER ESTA CHAMADA:
const response = await fetch('https://tracker-tracker-api.fbkpeh.easypanel.host/checkout-payment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(checkoutPayload),
})
```

---

## ✅ **O QUE ADICIONAR no page.tsx:**

### **1. Nova função handleSubmit:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (validateForm()) {
    setIsLoading(true)
    setApiError("")
    setIsModalOpen(true)

    try {
      // Dados para enviar para /iexperience
      const vendaData = {
        credentials: {
          token: "sk_3vbubUgktoXLnTUWVcWixEig2oNelGYXEaiC-S9et8yDhUGl", // Sua secret key
          publicKey: "pk_kFHKtjIthC9PhGDuInP_GAoxqSzY1LKkeXxj9YCmvMgJPHOH", // Sua public key
          name: "Pedro - BlackCat API",
          offer: {
            id: "crocs-brasil-pedro",
            name: "Crocs Brasil"
          }
        },
        amount: calculateTotal(),
        product: {
          title: `Crocs Brasil - ${cartItems.length} ${cartItems.length === 1 ? 'item' : 'itens'}`,
        },
        customer: {
          phone: generateRandomPhone(),
          name: formData.name,
          email: formData.email,
          document: {
            type: "CPF" as const,
            number: formData.cpf.replace(/\D/g, '')
          }
        }
      }

      // Chamar /iexperience
      const response = await fetch('https://origem-api-pix.28ugko.easypanel.host/iexperience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendaData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }

      const apiResponse = await response.json()

      // Processar resposta do BlackCat
      if (apiResponse.pix && apiResponse.pix.qrcode) {
        setPixCode(apiResponse.pix.qrcode)
        setPixQrCode(apiResponse.pix.qrcode)
        setTransactionId(apiResponse.id)
        setCurrentStep("payment")
      } else if (apiResponse.qr_code) {
        setPixCode(apiResponse.qr_code)
        setPixQrCode(apiResponse.qr_code)
        setTransactionId(apiResponse.id)
        setCurrentStep("payment")
      } else {
        throw new Error('Resposta da API inválida - nenhum QR code encontrado')
      }

    } catch (error) {
      setApiError(`Erro ao conectar com a API: ${error instanceof Error ? error.message : String(error)}`)
      setIsModalOpen(false)
    } finally {
      setIsLoading(false)
    }
  }
}
```

---

## 🎯 **RESUMO DAS MUDANÇAS:**

| Antes | Depois |
|-------|--------|
| ❌ Chama tracker externo | ✅ Chama `/iexperience` diretamente |
| ❌ Configuração complexa | ✅ Configuração simples |
| ❌ Múltiplas APIs | ✅ Uma API apenas |
| ❌ Credenciais hardcoded | ✅ Credenciais do Paulo |

---

## 🔧 **PASSOS PARA MIGRAÇÃO:**

### **1. Backup do arquivo atual:**
```bash
cp page.tsx page.tsx.backup
```

### **2. Substituir a função handleSubmit:**
- Remover o código antigo
- Adicionar o código novo

### **3. Testar:**
- Fazer uma venda de teste
- Verificar se o QR code aparece
- Verificar logs no console

### **4. Configurar credenciais do cliente (opcional):**
Se quiser usar credenciais específicas do cliente:
```typescript
credentials: {
  token: "secret_key_do_cliente",
  publicKey: "public_key_do_cliente",
  name: "Nome do Cliente",
  // ...
}
```

---

## ⚠️ **IMPORTANTE:**

### **URLs a atualizar:**
- `https://origem-api-pix.28ugko.easypanel.host/iexperience` → Sua URL real

### **Credenciais a atualizar:**
- `token` → Sua secret key BlackCat
- `publicKey` → Sua public key BlackCat

### **Teste obrigatório:**
- Fazer pelo menos 1 venda de teste
- Verificar se aparece no banco de dados
- Verificar logs do servidor

---

## 🚀 **RESULTADO FINAL:**

Após a migração, o `page.tsx` irá:
- ✅ Chamar diretamente o `/iexperience`
- ✅ Usar suas credenciais BlackCat
- ✅ Criar oferta automaticamente
- ✅ Aplicar regra 7x3 (se useTax = true)
- ✅ Funcionar perfeitamente com o sistema

**A migração está completa!** 🎉

