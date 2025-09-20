# 🔄 MIGRAÇÃO FINAL: page.tsx para iexperience.ts

## 📋 **INSTRUÇÕES PASSO A PASSO:**

### **1️⃣ FAZER BACKUP:**
```bash
cp page.tsx page.tsx.backup
```

### **2️⃣ LOCALIZAR a função handleSubmit no seu page.tsx:**
Procure por esta linha:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
```

### **3️⃣ REMOVER todo o código da função handleSubmit atual:**
Remover desde `const handleSubmit = async (e: React.FormEvent) => {` até o `}` correspondente.

### **4️⃣ SUBSTITUIR pela nova função:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (validateForm()) {
    setIsLoading(true)
    setApiError("")
    setIsModalOpen(true)

    try {
      const vendaData = {
        credentials: {
          token: "sk_3vbubUgktoXLnTUWVcWixEig2oNelGYXEaiC-S9et8yDhUGl",
          publicKey: "pk_kFHKtjIthC9PhGDuInP_GAoxqSzY1LKkeXxj9YCmvMgJPHOH",
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

      const response = await fetch('https://tracker-tracker-api.fbkpeh.easypanel.host/iexperience', {
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

### **5️⃣ TESTAR:**
1. Fazer uma venda de teste
2. Verificar se o QR code aparece
3. Verificar logs no console
4. Verificar se a venda aparece no banco de dados

---

## ✅ **RESULTADO ESPERADO:**

Após a migração, o `page.tsx` irá:
- ✅ Chamar `https://tracker-tracker-api.fbkpeh.easypanel.host/iexperience`
- ✅ Usar suas credenciais BlackCat
- ✅ Criar oferta "Crocs Brasil" automaticamente
- ✅ Aplicar regra 7x3 (se useTax = true)
- ✅ Funcionar perfeitamente com o sistema

---

## 🚨 **IMPORTANTE:**

### **Credenciais atuais:**
- **Token**: `sk_3vbubUgktoXLnTUWVcWixEig2oNelGYXEaiC-S9et8yDhUGl`
- **Public Key**: `pk_kFHKtjIthC9PhGDuInP_GAoxqSzY1LKkeXxj9YCmvMgJPHOH`

### **URL da API:**
- **Endpoint**: `https://tracker-tracker-api.fbkpeh.easypanel.host/iexperience`

### **Oferta criada:**
- **ID**: `crocs-brasil-pedro`
- **Nome**: `Crocs Brasil`

---

## 🎯 **MIGRAÇÃO COMPLETA!**

Siga estes passos e seu `page.tsx` funcionará perfeitamente com o `iexperience.ts`! 🚀
