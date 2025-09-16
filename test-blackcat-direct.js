// Teste direto da API BlackCat
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
      title: "Produto Teste BlackCat",
      description: "Produto Teste BlackCat",
      quantity: 1,
      unitPrice: 9700,
      tangible: false
    }
  ],
  externalId: `test_${Date.now()}`,
  callbackUrl: "https://tracker-tracker-api.fbkpeh.easypanel.host/webhook-blackcat"
};

async function testBlackCatDirect() {
  try {
    console.log("🧪 Testando API BlackCat diretamente...");
    console.log("📤 Payload:", JSON.stringify(payload, null, 2));
    console.log("🔑 Auth:", auth);
    
    const response = await fetch("https://api.blackcatpagamentos.com/v1/transactions", {
      method: "POST",
      headers: {
        "Authorization": auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    console.log("📥 Resposta recebida:");
    console.log("Status:", response.status);
    console.log("Dados:", JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log("✅ Teste BlackCat direto bem-sucedido!");
    } else {
      console.log("❌ Teste BlackCat direto falhou!");
    }
  } catch (error) {
    console.error("❌ Erro no teste direto:", error.message);
  }
}

testBlackCatDirect();
