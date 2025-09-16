// Debug das credenciais AllowPay

console.log("🔍 DEBUG DAS CREDENCIAIS ALLOWPAY");
console.log("================================\n");

// Verificar variáveis de ambiente
console.log("📋 Variáveis de ambiente:");
console.log(`ALLOWPAY_SECRET_KEY: ${process.env.ALLOWPAY_SECRET_KEY ? 'DEFINIDA' : 'NÃO DEFINIDA'}`);
console.log(`ALLOWPAY_COMPANY_ID: ${process.env.ALLOWPAY_COMPANY_ID ? 'DEFINIDA' : 'NÃO DEFINIDA'}`);
console.log(`ALLOWPAY_WEBHOOK_SECRET: ${process.env.ALLOWPAY_WEBHOOK_SECRET ? 'DEFINIDA' : 'NÃO DEFINIDA'}`);

// Mostrar valores (mascarados por segurança)
if (process.env.ALLOWPAY_SECRET_KEY) {
  const masked = process.env.ALLOWPAY_SECRET_KEY.substring(0, 10) + "..." + process.env.ALLOWPAY_SECRET_KEY.substring(process.env.ALLOWPAY_SECRET_KEY.length - 4);
  console.log(`Secret Key (mascarada): ${masked}`);
}

if (process.env.ALLOWPAY_COMPANY_ID) {
  console.log(`Company ID: ${process.env.ALLOWPAY_COMPANY_ID}`);
}

// Importar as credenciais do modelo
const { allowPaymentsCredentials } = require('./src/models/api');

console.log("\n📋 Credenciais carregadas do modelo:");
console.log(`API URL: ${allowPaymentsCredentials.apiUrl}`);
console.log(`Secret Key: ${allowPaymentsCredentials.secretKey.substring(0, 10)}...${allowPaymentsCredentials.secretKey.substring(allowPaymentsCredentials.secretKey.length - 4)}`);
console.log(`Company ID: ${allowPaymentsCredentials.companyId}`);

// Testar autenticação Basic
const auth = 'Basic ' + Buffer.from(allowPaymentsCredentials.secretKey + ':' + allowPaymentsCredentials.companyId).toString('base64');
console.log(`\n🔐 Auth Basic gerada: ${auth.substring(0, 20)}...`);

// Testar uma requisição simples
async function testAllowPayConnection() {
  try {
    console.log("\n🧪 Testando conexão com AllowPay...");
    
    const response = await fetch(`${allowPaymentsCredentials.apiUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth,
      },
      body: JSON.stringify({
        amount: 100, // 1 real em centavos
        currency: "BRL",
        paymentMethod: "pix",
        customer: {
          name: "Teste",
          email: "teste@teste.com",
          document: {
            type: "CPF",
            number: "12345678901"
          },
          phone: "11999999999"
        },
        product: {
          title: "Teste",
          description: "Teste de conexão"
        },
        externalId: `test_${Date.now()}`,
        callbackUrl: "https://tracker-tracker-api.fbkpeh.easypanel.host/webhook-allowpayments"
      })
    });

    console.log(`Status: ${response.status}`);
    const responseText = await response.text();
    console.log(`Resposta: ${responseText}`);

    if (response.status === 401) {
      console.log("\n❌ ERRO 401 - Credenciais inválidas!");
      console.log("🔍 Possíveis causas:");
      console.log("1. Secret Key incorreta");
      console.log("2. Company ID incorreto");
      console.log("3. Formato da autenticação Basic incorreto");
      console.log("4. Conta AllowPay inativa ou suspensa");
    } else if (response.status === 200 || response.status === 201) {
      console.log("\n✅ Conexão bem-sucedida!");
    } else {
      console.log(`\n⚠️  Status inesperado: ${response.status}`);
    }

  } catch (error) {
    console.error("❌ Erro na requisição:", error.message);
  }
}

testAllowPayConnection();
