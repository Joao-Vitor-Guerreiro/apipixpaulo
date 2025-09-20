// SUBSTITUIR APENAS A FUNÇÃO handleSubmit NO SEU page.tsx

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (validateForm()) {
    setIsLoading(true)
    setApiError("")
    setIsModalOpen(true)

    try {
      // Configuração para usar diretamente o /iexperience
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

      // Chamar diretamente o /iexperience
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

// REMOVER COMPLETAMENTE do seu page.tsx:
// 1. Todo o bloco checkoutPayload
// 2. A chamada para https://tracker-tracker-api.fbkpeh.easypanel.host/checkout-payment
// 3. As configurações do AllowPay e BlackCat dentro do payload
// 4. Os campos paymentProvider, gateway, blackcat, allowpay, allowPay
