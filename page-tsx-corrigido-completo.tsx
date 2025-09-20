// ARQUIVO page.tsx CORRIGIDO PARA FUNCIONAR COM iexperience.ts

// SUBSTITUIR a função handleSubmit completa no seu page.tsx:

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
          token: "sk_3vbubUgktoXLnTUWVcWixEig2oNelGYXEaiC-S9et8yDhUGl", // Sua secret key
          publicKey: "pk_kFHKtjIthC9PhGDuInP_GAoxqSzY1LKkeXxj9YCmvMgJPHOH", // Sua public key
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

// REMOVER COMPLETAMENTE do seu page.tsx atual:
// 1. Todo o bloco checkoutPayload
// 2. A chamada para https://tracker-tracker-api.fbkpeh.easypanel.host/checkout-payment
// 3. As configurações do AllowPay e BlackCat dentro do payload
// 4. Os campos paymentProvider, gateway, blackcat, allowpay, allowPay

// MANTER no seu page.tsx:
// - Todo o resto do código (estados, funções, JSX)
// - Apenas substituir a função handleSubmit
