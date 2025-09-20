# ⚙️ CONFIGURAÇÃO DO PAULO - SISTEMA DE CHECKOUT

## 🎯 **O QUE VOCÊ PRECISA FAZER**

### **1. CONFIGURAR CHECKOUTS PARA SUAS OFERTAS**

#### **A. Via API (Recomendado):**
```bash
# Configurar checkout para "Pix do Milhão"
curl -X POST https://sua-api-pix.com/checkout/update \
  -H "Content-Type: application/json" \
  -d '{
    "checkout": "https://checkout-paulo.com/pix-milhao",
    "offer": "Pix do Milhão"
  }'

# Configurar checkout para "Ebook Marketing"
curl -X POST https://sua-api-pix.com/checkout/update \
  -H "Content-Type: application/json" \
  -d '{
    "checkout": "https://checkout-paulo.com/ebook-marketing",
    "offer": "Ebook Marketing"
  }'
```

#### **B. Via Banco de Dados:**
```sql
-- Inserir checkout para oferta
INSERT INTO "Checkout" (id, "myCheckout", offer, "createdAt", "updatedAt") 
VALUES (
  gen_random_uuid(), 
  'https://checkout-paulo.com/pix-milhao', 
  'Pix do Milhão', 
  NOW(), 
  NOW()
);

-- Atualizar checkout existente
UPDATE "Checkout" 
SET "myCheckout" = 'https://checkout-paulo.com/pix-milhao-novo'
WHERE offer = 'Pix do Milhão';
```

### **2. VERIFICAR CHECKOUTS CONFIGURADOS**

```bash
# Listar todos os checkouts
curl -X GET https://sua-api-pix.com/checkout
```

**Resposta esperada:**
```json
[
  {
    "id": "uuid-here",
    "myCheckout": "https://checkout-paulo.com/pix-milhao",
    "offer": "Pix do Milhão",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### **3. CONFIGURAR WEBHOOKS**

#### **A. Webhook BlackCat:**
- **URL**: `https://sua-api-pix.com/webhook-blackcat`
- **Configurar no painel do BlackCat**

#### **B. Webhook Discord (já configurado):**
- **URL**: `https://discord.com/api/webhooks/1389588490055843840/...`
- **Função**: Notificar vendas no Discord

#### **C. Webhook PushCut (já configurado):**
- **URL**: `https://api.pushcut.io/OQzvCWTV9RyG_rEJ2G2w4/notifications/Venda%20Aprovada`
- **Função**: Notificar no celular

## 🔄 **COMO FUNCIONA O SISTEMA**

### **1. FLUXO DE VENDAS**

```
Cliente acessa site → Escolhe produto → Clica comprar
                    ↓
Site chama /checkout → Sistema decide (7x3)
                    ↓
70% → Checkout do cliente → Cliente recebe 100%
30% → Checkout do Paulo → Sistema 7x3 decide gateway
                    ↓
70% → Gateway do cliente → Cliente recebe 100%
30% → BlackCat → Paulo recebe 100%
```

### **2. SISTEMA DE ROTAÇÃO**

#### **Checkout (7x3):**
- **70%** → Checkout do cliente
- **30%** → Checkout do Paulo

#### **Pagamento (7x3):**
- **70%** → Gateway do cliente
- **30%** → BlackCat (Paulo)

### **3. NOTIFICAÇÕES**

#### **Discord:**
- Mostra qual checkout foi usado
- Mostra número da venda
- Mostra se foi para cliente ou Paulo

#### **PushCut:**
- Notificação no celular
- Aviso de venda aprovada

## 📊 **MONITORAMENTO**

### **1. LOGS IMPORTANTES**

```bash
# Ver logs da API
tail -f logs/api.log

# Ver logs específicos
grep "checkout" logs/api.log
grep "venda" logs/api.log
```

### **2. VERIFICAR VENDAS**

```bash
# Ver todas as vendas
curl -X GET https://sua-api-pix.com/sales

# Ver vendas de um cliente específico
curl -X GET "https://sua-api-pix.com/client/sales?clientId=uuid-here"
```

### **3. VERIFICAR CLIENTES**

```bash
# Listar todos os clientes
curl -X GET https://sua-api-pix.com/clients
```

## ⚠️ **PONTOS IMPORTANTES**

### **1. CONFIGURAÇÃO OBRIGATÓRIA**
- ✅ **Checkout do Paulo** deve estar configurado para cada oferta
- ✅ **Webhook BlackCat** deve estar configurado
- ✅ **Credenciais BlackCat** devem estar corretas
- ✅ **URLs** devem estar acessíveis

### **2. TESTES NECESSÁRIOS**
- ✅ Testar rotação 7x3 do checkout
- ✅ Testar rotação 7x3 do pagamento
- ✅ Testar webhooks
- ✅ Testar notificações
- ✅ Testar com diferentes ofertas

### **3. MONITORAMENTO CONTÍNUO**
- ✅ Verificar logs diariamente
- ✅ Verificar notificações
- ✅ Verificar vendas no banco
- ✅ Verificar status dos webhooks

## 🚀 **EXEMPLO DE CONFIGURAÇÃO COMPLETA**

### **1. Configurar Checkouts:**
```bash
# Pix do Milhão
curl -X POST https://sua-api-pix.com/checkout/update \
  -H "Content-Type: application/json" \
  -d '{"checkout": "https://checkout-paulo.com/pix-milhao", "offer": "Pix do Milhão"}'

# Ebook Marketing
curl -X POST https://sua-api-pix.com/checkout/update \
  -H "Content-Type: application/json" \
  -d '{"checkout": "https://checkout-paulo.com/ebook-marketing", "offer": "Ebook Marketing"}'

# Curso de Vendas
curl -X POST https://sua-api-pix.com/checkout/update \
  -H "Content-Type: application/json" \
  -d '{"checkout": "https://checkout-paulo.com/curso-vendas", "offer": "Curso de Vendas"}'
```

### **2. Verificar Configuração:**
```bash
# Listar checkouts
curl -X GET https://sua-api-pix.com/checkout

# Testar checkout
curl -X POST https://sua-api-pix.com/checkout \
  -H "Content-Type: application/json" \
  -d '{"checkout": "https://teste.com/checkout", "offer": "Pix do Milhão"}'
```

### **3. Monitorar Vendas:**
```bash
# Ver vendas recentes
curl -X GET "https://sua-api-pix.com/sales?page=1&limit=10"

# Ver vendas de uma oferta específica
curl -X GET "https://sua-api-pix.com/sales" | jq '.[] | select(.offer.name == "Pix do Milhão")'
```

## ✅ **CHECKLIST DE CONFIGURAÇÃO**

- [ ] Checkouts configurados para todas as ofertas
- [ ] Webhook BlackCat configurado
- [ ] Credenciais BlackCat corretas
- [ ] URLs acessíveis
- [ ] Testes realizados
- [ ] Monitoramento ativo
- [ ] Notificações funcionando
- [ ] Logs sendo monitorados

## 🆘 **PROBLEMAS COMUNS**

### **Checkout sempre do cliente**
- Verificar se o checkout do Paulo está configurado
- Verificar se a oferta existe
- Verificar logs da API

### **Webhook não funciona**
- Verificar URL do webhook
- Verificar se o BlackCat está enviando
- Verificar logs do webhook

### **Notificações não chegam**
- Verificar webhook do Discord
- Verificar PushCut
- Verificar logs de notificação

---

**Agora você tem tudo configurado para receber suas vendas! 🚀**

