# 🚀 GUIA RÁPIDO: Como Adicionar Novo Gateway

## 🎯 **GATEWAY PADRÃO ATUAL: BLACKCAT**
- **URL**: `https://api.blackcatpagamentos.com/v1/transactions`
- **Auth**: Basic Auth (public:secret)
- **Webhook**: `/webhook-blackcat`

## ⚡ **PASSO A PASSO (5 MINUTOS)**

### **1. CRIAR CONTROLADOR**
```bash
# Copie o template
cp src/controllers/template-gateway.ts src/controllers/novo-gateway.ts
```

### **2. CONFIGURAR O GATEWAY**
Edite `src/controllers/novo-gateway.ts`:

```typescript
// ⚠️ ALTERE ESTAS LINHAS:
let provider = "meu-gateway"; // Nome do seu gateway

// URL da API
apiUrl = "https://api.meu-gateway.com/v1/payments";

// Headers (tipo de autenticação)
headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${tokenToUse}`, // ou "Token ${tokenToUse}"
};

// Formato do payload
paymentData = {
  // Configure aqui o formato que o gateway espera
  customer: { ... },
  amount: data.amount,
  // ...
};

// Campo que retorna o ID da transação
ghostId: responseJson.id || responseJson.payment_id
```

### **3. CRIAR WEBHOOK**
```bash
# Copie o template
cp src/controllers/template-webhook.ts src/controllers/webhook-meu-gateway.ts
```

Configure o webhook:
```typescript
// Como o gateway envia os dados
const { status, paymentId, id } = req.body;

// Lógica de aprovação
const isApproved = status === "paid" || status === "APPROVED";
```

### **4. ADICIONAR ROTAS**
Edite `src/app/routes/routes.ts`:

```typescript
import { novoGatewayController } from "../../controllers/novo-gateway";
import { webhookMeuGatewayController } from "../../controllers/webhook-meu-gateway";

// Adicione as rotas
ofertRouter.post("/meu-gateway", novoGatewayController.create);
ofertRouter.post("/webhook-meu-gateway", webhookMeuGatewayController.main);
```

### **5. TESTAR**
```bash
# Inicie o servidor
npm run dev

# Teste a rota
curl -X POST http://localhost:3434/meu-gateway \
  -H "Content-Type: application/json" \
  -d '{
    "credentials": {
      "token": "token-do-cliente",
      "name": "Cliente Teste"
    },
    "amount": 100,
    "product": {
      "title": "Produto Teste"
    },
    "customer": {
      "name": "João Silva",
      "email": "joao@email.com",
      "phone": "11999999999",
      "document": {
        "type": "CPF",
        "number": "12345678901"
      }
    }
  }'
```

## 📋 **CHECKLIST RÁPIDO**

- [ ] Controlador criado e configurado
- [ ] Webhook criado e configurado  
- [ ] Rotas adicionadas
- [ ] Testado localmente
- [ ] Cliente adicionado automaticamente

## 🔧 **CONFIGURAÇÕES IMPORTANTES**

### **Sistema 7x3**
- 70% das vendas vão para o cliente
- 30% vão para você (GhostPay)
- Funciona automaticamente

### **Criação de Clientes**
- Clientes são criados automaticamente na primeira requisição
- Não precisa cadastrar manualmente

### **Ofertas**
- São criadas automaticamente baseadas no nome do produto
- Ou podem ser enviadas via `credentials.offer`

## 🆘 **PROBLEMAS COMUNS**

### **Erro 500**
- Verifique se a URL da API está correta
- Verifique se o formato do payload está correto
- Verifique se o token de autenticação está correto

### **Webhook não funciona**
- Verifique se a URL do webhook está correta
- Verifique se o campo de ID da transação está correto
- Verifique se a lógica de aprovação está correta

### **Cliente não é criado**
- Verifique se o token está sendo enviado
- Verifique se o nome do cliente está sendo enviado
