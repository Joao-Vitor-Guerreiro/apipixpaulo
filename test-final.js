// Teste final da integração BlackCat
const publicKey = "pk_kFHKtjIthC9PhGDuInP_GAoxqSzY1LKkeXxj9YCmvMgJPHOH";
const secretKey = "sk_3vbubUgktoXLnTUWVcWixEig2oNelGYXEaiC-S9et8yDhUGl";
const auth = 'Basic ' + Buffer.from(publicKey + ':' + secretKey).toString('base64');

const payload = {
  amount: 9700, // 97.00 em centavos
  paymentMethod: "pix",
  customer: {
    name: "João Silva Teste",
    email: "joao.teste@email.com",
    document: {
      type: "cpf",
      number: "12345678901"
    },
    phone: "11999999999"
  },
  items: [
    {
      title: "Produto Teste Final",
      description: "Produto Teste Final",
      quantity: 1,
      unitPrice: 9700,
      tangible: false
    }
  ],
  externalId: `test_final_${Date.now()}`,
  callbackUrl: "https://tracker-tracker-api.fbkpeh.easypanel.host/webhook-blackcat"
};

async function testFinal() {
  try {
    console.log("🧪 TESTE FINAL - BlackCat Pagamentos");
    console.log("=====================================");
    console.log("📤 Enviando transação PIX...");
    console.log("💰 Valor: R$ 97,00");
    console.log("👤 Cliente: João Silva Teste");
    console.log("📦 Produto: Produto Teste Final");
    
    const response = await fetch("https://api.blackcatpagamentos.com/v1/transactions", {
      method: "POST",
      headers: {
        "Authorization": auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    console.log("\n📥 RESPOSTA DA BLACKCAT:");
    console.log("=========================");
    console.log("Status:", response.status);
    
    if (response.ok) {
      console.log("✅ SUCESSO! Transação criada com sucesso!");
      console.log("🆔 ID da Transação:", result.id);
      console.log("💰 Valor:", `R$ ${(result.amount / 100).toFixed(2)}`);
      console.log("📱 Status:", result.status);
      console.log("🔗 QR Code PIX:", result.pix?.qrcode ? "Gerado" : "Não gerado");
      console.log("⏰ Expira em:", result.pix?.expirationDate);
      
      console.log("\n🎉 INTEGRAÇÃO BLACKCAT FUNCIONANDO PERFEITAMENTE!");
      console.log("================================================");
    } else {
      console.log("❌ ERRO na transação:");
      console.log("Mensagem:", result.message || "Erro desconhecido");
      console.log("Detalhes:", JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error("❌ Erro no teste:", error.message);
  }
}

testFinal();




