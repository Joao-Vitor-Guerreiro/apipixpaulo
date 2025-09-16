// Arquivo de teste para Allow Payments
// Execute com: node test-allowpayments.js

const testData = {
  credentials: {
    token: "test-client-token-123",
    name: "Cliente Teste Allow Payments",
    offer: {
      id: "offer-allowpayments-001",
      name: "Oferta Allow Payments Teste"
    }
  },
  amount: 97.00,
  product: {
    title: "Produto Teste Allow Payments"
  },
  customer: {
    phone: "11999999999",
    name: "João Silva Teste",
    email: "joao.teste@email.com",
    document: {
      type: "CPF",
      number: "12345678901"
    }
  }
};

async function testAllowPayments() {
  try {
    console.log("🧪 Testando integração Allow Payments...");
    console.log("📤 Dados enviados:", JSON.stringify(testData, null, 2));
    
    const response = await fetch("http://localhost:3434/allowpayments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    console.log("📥 Resposta recebida:");
    console.log("Status:", response.status);
    console.log("Dados:", JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log("✅ Teste bem-sucedido!");
    } else {
      console.log("❌ Teste falhou!");
    }
  } catch (error) {
    console.error("❌ Erro no teste:", error.message);
  }
}

// Teste do webhook
async function testWebhook() {
  try {
    console.log("\n🧪 Testando webhook Allow Payments...");
    
    const webhookData = {
      id: "test-payment-123",
      status: "APPROVED",
      payment_id: "test-payment-123",
      data: {
        id: "test-payment-123",
        status: "APPROVED"
      }
    };
    
    console.log("📤 Dados do webhook:", JSON.stringify(webhookData, null, 2));
    
    const response = await fetch("http://localhost:3434/webhook-allowpayments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(webhookData)
    });

    const result = await response.json();
    
    console.log("📥 Resposta do webhook:");
    console.log("Status:", response.status);
    console.log("Dados:", JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log("✅ Webhook testado com sucesso!");
    } else {
      console.log("❌ Webhook falhou!");
    }
  } catch (error) {
    console.error("❌ Erro no teste do webhook:", error.message);
  }
}

// Executar testes
console.log("🚀 Iniciando testes da integração Allow Payments...\n");

testAllowPayments()
  .then(() => {
    console.log("\n⏳ Aguardando 2 segundos antes do teste do webhook...");
    setTimeout(testWebhook, 2000);
  })
  .catch(error => {
    console.error("❌ Erro geral:", error);
  });

