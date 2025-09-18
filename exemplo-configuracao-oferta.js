// EXEMPLO DE COMO CONFIGURAR SUA NOVA OFERTA
// 
// 1. Configure o checkout da sua oferta para chamar nossa API:
// 
// URL: https://tracker-tracker-api.fbkpeh.easypanel.host/checkout-payment
// Método: POST
// 
// 2. Payload que sua oferta deve enviar:
const exemploPayload = {
  checkout: "https://sua-oferta.com/checkout", // URL do checkout da sua oferta
  offer: "nome-da-sua-oferta", // Nome único da oferta
  customer: {
    name: "João Silva",
    email: "joao@email.com",
    document: {
      type: "CPF",
      number: "12345678901"
    },
    phone: "11999999999"
  },
  product: {
    title: "Produto da Sua Oferta",
    description: "Descrição do produto"
  },
  amount: 97.00, // Valor em reais
  credentials: {
    name: "Nome do Cliente",
    token: "token-do-cliente", // Token do cliente que vai receber as vendas
    offer: {
      id: "nome-da-sua-oferta",
      name: "Nome da Sua Oferta"
    }
  }
};

// 3. Como funciona a regra 7x3:
// - Vendas 1-7: Vão para AllowPay (cliente)
// - Vendas 8-10: Vão para BlackCat (você)
// - Depois repete o ciclo

// 4. Resposta da API:
const exemploResposta = {
  // Dados do PIX gerado
  pixCode: "00020126360014BR...",
  pixUrl: "https://pix.example.com/qr/...",
  transactionId: "tx_123456789",
  
  // Informações do ciclo atual
  cycle: 3, // 1-10
  totalSales: 23, // Total de vendas da oferta
  gateway: "allowpayments", // ou "blackcat"
  toClient: true, // true = cliente, false = você
  
  // Checkout que deve ser usado
  checkout: "https://sua-oferta.com/checkout"
};

// 5. Webhooks configurados:
// - AllowPay: https://tracker-tracker-api.fbkpeh.easypanel.host/webhook-allowpayments
// - BlackCat: https://tracker-tracker-api.fbkpeh.easypanel.host/webhook-blackcat

// 6. Para testar localmente:
// npm run dev
// curl -X POST http://localhost:3000/checkout-payment -H "Content-Type: application/json" -d '{"checkout":"https://teste.com","offer":"teste","customer":{"name":"Teste","email":"teste@teste.com","document":{"type":"CPF","number":"12345678901"},"phone":"11999999999"},"product":{"title":"Produto Teste"},"amount":97,"credentials":{"name":"Cliente Teste","token":"token123","offer":{"id":"teste","name":"Teste"}}}'

console.log("Configuração da nova oferta:");
console.log("1. Configure o checkout para chamar: https://tracker-tracker-api.fbkpeh.easypanel.host/checkout-payment");
console.log("2. Envie o payload com os dados do cliente e produto");
console.log("3. A API aplicará automaticamente a regra 7x3");
console.log("4. Receberá o PIX code e URL para pagamento");
console.log("5. Os webhooks confirmarão os pagamentos automaticamente");












