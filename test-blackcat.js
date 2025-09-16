// Arquivo de teste para BlackCat Pagamentos
// Execute com: node test-blackcat.js

const testData = {
  credentials: {
    token: "test-client-token-123",
    name: "Cliente Teste BlackCat",
    offer: {
      id: "offer-blackcat-001",
      name: "Oferta BlackCat Teste"
    }
  },
  amount: 97.00,
  product: {
    title: "Produto Teste BlackCat"
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

async function testBlackCat() {
  try {
    console.log("🧪 Testando integração BlackCat Pagamentos...");
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
    console.log("\n🧪 Testando webhook BlackCat...");
    
    const webhookData = {
      id: "test-payment-blackcat-123",
      status: "APPROVED",
      payment_id: "test-payment-blackcat-123",
      event: "payment.approved",
      data: {
        id: "test-payment-blackcat-123",
        status: "APPROVED"
      }
    };
    
    console.log("📤 Dados do webhook:", JSON.stringify(webhookData, null, 2));
    
    const response = await fetch("http://localhost:3434/webhook-blackcat", {
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
console.log("🚀 Iniciando testes da integração BlackCat Pagamentos...\n");

testBlackCat()
  .then(() => {
    console.log("\n⏳ Aguardando 2 segundos antes do teste do webhook...");
    setTimeout(testWebhook, 2000);
  })
  .catch(error => {
    console.error("❌ Erro geral:", error);
  });






