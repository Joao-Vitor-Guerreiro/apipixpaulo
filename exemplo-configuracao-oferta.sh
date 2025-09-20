#!/bin/bash

# 🚀 EXEMPLO PRÁTICO: CONFIGURAR NOVA OFERTA
# Execute este script para configurar uma nova oferta

# ========================================
# 1️⃣ CONFIGURAÇÕES
# ========================================

API_URL="https://sua-api-pix.com"  # ⚠️ ALTERE AQUI
OFERTA_NOME="Curso de Marketing Digital"
CHECKOUT_PAULO="https://checkout-paulo.com/curso-marketing"

echo "🚀 Configurando nova oferta: $OFERTA_NOME"

# ========================================
# 2️⃣ CONFIGURAR CHECKOUT DO PAULO
# ========================================

echo "📋 Configurando checkout do Paulo..."

curl -X POST "$API_URL/checkout/update" \
  -H "Content-Type: application/json" \
  -d "{
    \"checkout\": \"$CHECKOUT_PAULO\",
    \"offer\": \"$OFERTA_NOME\"
  }" \
  -w "\nStatus: %{http_code}\n" \
  -s

if [ $? -eq 0 ]; then
  echo "✅ Checkout configurado com sucesso!"
else
  echo "❌ Erro ao configurar checkout"
  exit 1
fi

# ========================================
# 3️⃣ OBTER ID DA OFERTA
# ========================================

echo "🔍 Buscando ID da oferta..."

# Fazer uma venda de teste para criar a oferta
curl -X POST "$API_URL/gerarpix" \
  -H "Content-Type: application/json" \
  -d "{
    \"credentials\": {
      \"token\": \"teste_token_123\",
      \"name\": \"Cliente Teste\"
    },
    \"amount\": 1,
    \"product\": {
      \"title\": \"$OFERTA_NOME\"
    },
    \"customer\": {
      \"name\": \"Teste\",
      \"email\": \"teste@email.com\",
      \"phone\": \"11999999999\",
      \"document\": {
        \"type\": \"CPF\",
        \"number\": \"12345678901\"
      }
    }
  }" \
  -w "\nStatus: %{http_code}\n" \
  -s

echo "✅ Oferta criada automaticamente!"

# ========================================
# 4️⃣ OBTER LISTA DE CLIENTES E OFERTAS
# ========================================

echo "📊 Listando clientes e ofertas..."

curl -X GET "$API_URL/clients" \
  -H "Content-Type: application/json" \
  -s | jq '.[] | {id: .id, name: .name, offers: [.offers[] | {id: .id, name: .name, useTax: .useTax}]}'

# ========================================
# 5️⃣ CONFIGURAR useTax (PARA RECEBER VENDAS)
# ========================================

echo "⚙️ Configurando useTax para receber vendas..."

# Nota: Você precisa substituir OFERTA_ID pelo ID real da oferta
echo "⚠️  IMPORTANTE: Substitua OFERTA_ID pelo ID real da oferta acima"

# Exemplo de como configurar useTax (descomente e ajuste o ID)
# curl -X POST "$API_URL/use-tax" \
#   -H "Content-Type: application/json" \
#   -d "{
#     \"offerId\": \"OFERTA_ID_AQUI\",
#     \"useTax\": true
#   }" \
#   -w "\nStatus: %{http_code}\n" \
#   -s

echo "✅ useTax configurado! (Ajuste o ID da oferta acima)"

# ========================================
# 6️⃣ VERIFICAR CONFIGURAÇÃO
# ========================================

echo "🔍 Verificando configuração..."

# Verificar checkouts
echo "📋 Checkouts configurados:"
curl -X GET "$API_URL/checkout" \
  -H "Content-Type: application/json" \
  -s | jq '.[] | {offer: .offer, myCheckout: .myCheckout}'

# ========================================
# 7️⃣ TESTE DE INTEGRAÇÃO
# ========================================

echo "🧪 Testando integração..."

# Teste de checkout
echo "🔄 Testando sistema de checkout..."
curl -X POST "$API_URL/checkout" \
  -H "Content-Type: application/json" \
  -d "{
    \"checkout\": \"https://meusite.com/checkout\",
    \"offer\": \"$OFERTA_NOME\"
  }" \
  -w "\nStatus: %{http_code}\n" \
  -s

# ========================================
# 8️⃣ INSTRUÇÕES PARA O CLIENTE
# ========================================

echo "📋 INSTRUÇÕES PARA O CLIENTE:"
echo ""
echo "1. Configure as credenciais do gateway do cliente:"
echo "   - Token: Secret key do gateway do cliente"
echo "   - Nome: Nome do cliente"
echo ""
echo "2. Integre com sua API:"
echo "   - URL: $API_URL/gerarpix"
echo "   - Método: POST"
echo "   - Headers: Content-Type: application/json"
echo ""
echo "3. Exemplo de requisição:"
echo "   {"
echo "     \"credentials\": {"
echo "       \"token\": \"sk_cliente_123\","
echo "       \"name\": \"Nome do Cliente\""
echo "     },"
echo "     \"amount\": 297,"
echo "     \"product\": {"
echo "       \"title\": \"$OFERTA_NOME\""
echo "     },"
echo "     \"customer\": {"
echo "       \"name\": \"João Silva\","
echo "       \"email\": \"joao@email.com\","
echo "       \"phone\": \"11999999999\","
echo "       \"document\": {"
echo "         \"type\": \"CPF\","
echo "         \"number\": \"12345678901\""
echo "       }"
echo "     }"
echo "   }"
echo ""
echo "4. Sistema 7x3:"
echo "   - 70% das vendas vão para o cliente"
echo "   - 30% das vendas vão para o Paulo (BlackCat)"
echo "   - useTax = true para receber vendas"
echo ""

# ========================================
# 9️⃣ MONITORAMENTO
# ========================================

echo "📊 MONITORAMENTO:"
echo ""
echo "1. Verificar vendas:"
echo "   curl -X GET $API_URL/sales"
echo ""
echo "2. Verificar clientes:"
echo "   curl -X GET $API_URL/clients"
echo ""
echo "3. Verificar checkouts:"
echo "   curl -X GET $API_URL/checkout"
echo ""
echo "4. Logs da API:"
echo "   tail -f logs/api.log"
echo ""

echo "🎉 Configuração da oferta '$OFERTA_NOME' concluída!"
echo "🚀 Agora o cliente pode integrar e começar a vender!"


