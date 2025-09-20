// CORREÇÕES NECESSÁRIAS NO page.tsx

// 1. SUBSTITUIR a função handleSubmit completa:

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (validateForm()) {
    setIsLoading(true)
    setApiError("")
    setIsModalOpen(true) // Open modal immediately

    try {
      // Configuração para usar diretamente o /iexperience
      const vendaData = {
        credentials: {
          token: "sk_cliente_123456789", // Secret key do cliente BlackCat
          publicKey: "pk_cliente_987654321", // Public key do cliente BlackCat
          name: "Pedro - BlackCat API",
          offer: {
            id: "crocs-brasil-pedro",
            name: "Crocs Brasil"
          }
        },
        amount: calculateTotal(), // Valor em reais
        product: {
          title: `Crocs Brasil - ${cartItems.length} ${cartItems.length === 1 ? 'item' : 'itens'}`,
        },
        customer: {
          phone: generateRandomPhone(),
          name: formData.name,
          email: formData.email,
          document: {
            type: "CPF" as const,
            number: formData.cpf.replace(/\D/g, '') // Remove formatação
          }
        }
      }

      // Chamar diretamente o /iexperience da sua API
      const response = await fetch('https://sua-api.com/iexperience', {
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
        // Formato alternativo do BlackCat
        setPixCode(apiResponse.qr_code)
        setPixQrCode(apiResponse.qr_code)
        setTransactionId(apiResponse.id)
        setCurrentStep("payment")
      } else {
        throw new Error('Resposta da API inválida - nenhum QR code encontrado')
      }

    } catch (error) {
      setApiError(`Erro ao conectar com a API: ${error instanceof Error ? error.message : String(error)}`)
      setIsModalOpen(false) // Close modal on error
    } finally {
      setIsLoading(false)
    }
  }
}

// 2. REMOVER todo o código antigo da função handleSubmit que estava chamando:
// - https://tracker-tracker-api.fbkpeh.easypanel.host/checkout-payment
// - Configurações do AllowPay
// - Configurações do BlackCat dentro do payload

// 3. SUBSTITUIR as credenciais hardcoded pelas suas credenciais reais:
// - token: "sua_secret_key_blackcat"
// - publicKey: "sua_public_key_blackcat"

// 4. SUBSTITUIR a URL da API:
// - 'https://sua-api.com/iexperience' pela URL real da sua API

// 5. ADICIONAR tratamento para diferentes formatos de resposta do BlackCat:
// - apiResponse.pix.qrcode (formato padrão)
// - apiResponse.qr_code (formato alternativo)
// - apiResponse.id (ID da transação)
