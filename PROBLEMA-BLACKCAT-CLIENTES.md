# ⚠️ PROBLEMA IDENTIFICADO: BLACKCAT COM MÚLTIPLOS CLIENTES

## 🚨 **PROBLEMA CRÍTICO DESCOBERTO!**

### **❌ O QUE ESTÁ ERRADO:**

O sistema atual **NÃO FUNCIONA** para múltiplos clientes usando BlackCat porque:

1. **BlackCat precisa de PUBLIC KEY + SECRET KEY** (Basic Auth)
2. **Sistema só armazena SECRET KEY** do cliente no banco
3. **Sistema não tem como obter PUBLIC KEY** do cliente
4. **Sistema sempre usa PUBLIC KEY do Paulo** para todos os clientes

## 🔍 **ANÁLISE DO CÓDIGO ATUAL**

### **1. BANCO DE DADOS (schema.prisma):**
```sql
model Client {
  id  String @id @default(uuid())
  name String
  description String?
  token String @unique        -- ⚠️ SÓ ARMAZENA SECRET KEY
  useTax Boolean
  sales Sale[]
  offers Offer[]
  createdAt DateTime @default(now())
}
```

### **2. CONTROLADOR (create-pix.ts):**
```typescript
// ⚠️ PROBLEMA: Sempre usa public key do Paulo
const auth = 'Basic ' + Buffer.from(myCredentials.public + ':' + tokenToUse).toString('base64');
```

### **3. FLUXO ATUAL (INCORRETO):**
```typescript
// Cliente A envia: sk_blackcat_clienteA_123
// Sistema usa: pk_paulo + sk_blackcat_clienteA_123  ❌ ERRADO!
// Deveria usar: pk_clienteA + sk_blackcat_clienteA_123  ✅ CORRETO!
```

## 🔧 **SOLUÇÕES POSSÍVEIS**

### **OPÇÃO 1: CLIENTE ENVIA AMBAS AS CHAVES**

#### **Modificar interface:**
```typescript
interface CreatePixBody {
  credentials: {
    token: string;        // Secret key
    publicKey?: string;   // Public key (opcional)
    name: string;
  };
  // ... resto dos campos
}
```

#### **Modificar banco:**
```sql
model Client {
  id  String @id @default(uuid())
  name String
  description String?
  token String @unique        -- Secret key
  publicKey String?           -- Public key (novo campo)
  useTax Boolean
  sales Sale[]
  offers Offer[]
  createdAt DateTime @default(now())
}
```

#### **Modificar controlador:**
```typescript
// Se cliente tem public key, usa ela
// Se não tem, usa public key do Paulo (fallback)
const publicKeyToUse = client.publicKey || myCredentials.public;
const auth = 'Basic ' + Buffer.from(publicKeyToUse + ':' + tokenToUse).toString('base64');
```

### **OPÇÃO 2: DETECTAR GATEWAY PELO TOKEN**

#### **Sistema detecta automaticamente:**
```typescript
function detectGateway(token: string): string {
  if (token.startsWith('sk_blackcat_')) return 'blackcat';
  if (token.startsWith('sk_pagseguro_')) return 'pagseguro';
  if (token.startsWith('sk_mercadopago_')) return 'mercadopago';
  // ... outros gateways
  return 'unknown';
}
```

#### **Configurar autenticação baseada no gateway:**
```typescript
const gateway = detectGateway(clientToken);

if (gateway === 'blackcat') {
  // BlackCat - Basic Auth (precisa de public key)
  const publicKeyToUse = client.publicKey || myCredentials.public;
  const auth = 'Basic ' + Buffer.from(publicKeyToUse + ':' + tokenToUse).toString('base64');
} else {
  // Outros gateways - Bearer Token
  headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${tokenToUse}`
  };
}
```

### **OPÇÃO 3: BLACKCAT COMO GATEWAY ÚNICO**

#### **Forçar todos os clientes a usarem BlackCat:**
```typescript
// Todos os clientes devem ter public key + secret key do BlackCat
// Sistema sempre usa BlackCat para todos os clientes
const auth = 'Basic ' + Buffer.from(client.publicKey + ':' + client.secretKey).toString('base64');
```

## 🎯 **RECOMENDAÇÃO: OPÇÃO 1**

### **POR QUE A OPÇÃO 1 É MELHOR:**

1. **✅ Flexibilidade**: Cliente pode usar qualquer gateway
2. **✅ Compatibilidade**: Funciona com BlackCat e outros gateways
3. **✅ Simplicidade**: Cliente envia apenas o que precisa
4. **✅ Fallback**: Se não tiver public key, usa do Paulo

### **IMPLEMENTAÇÃO RECOMENDADA:**

#### **1. Atualizar schema do banco:**
```sql
ALTER TABLE "Client" ADD COLUMN "publicKey" TEXT;
```

#### **2. Atualizar interface:**
```typescript
interface CreatePixBody {
  credentials: {
    token: string;        // Secret key
    publicKey?: string;   // Public key (opcional)
    name: string;
  };
  // ... resto dos campos
}
```

#### **3. Atualizar controlador:**
```typescript
// Buscar ou criar cliente
let client = await prisma.client.findUnique({
  where: { token: clientToken },
});

if (!client) {
  client = await prisma.client.create({
    data: {
      name: data.credentials.name,
      token: clientToken,
      publicKey: data.credentials.publicKey || null, // Novo campo
      useTax: false,
    },
  });
}

// Usar public key do cliente ou fallback para Paulo
const publicKeyToUse = client.publicKey || myCredentials.public;
const auth = 'Basic ' + Buffer.from(publicKeyToUse + ':' + tokenToUse).toString('base64');
```

## 🚀 **RESUMO EXECUTIVO**

### **PROBLEMA ATUAL:**
- ❌ Sistema não funciona para múltiplos clientes BlackCat
- ❌ Sempre usa public key do Paulo
- ❌ Cliente não pode usar suas próprias credenciais

### **SOLUÇÃO RECOMENDADA:**
- ✅ Cliente envia public key + secret key
- ✅ Sistema usa credenciais do cliente
- ✅ Fallback para credenciais do Paulo
- ✅ Funciona com qualquer gateway

### **PRÓXIMOS PASSOS:**
1. **Atualizar schema** do banco
2. **Modificar interface** de entrada
3. **Atualizar controlador** para usar credenciais corretas
4. **Testar** com múltiplos clientes

---

**Agora você entende o problema e a solução! 🚀**


