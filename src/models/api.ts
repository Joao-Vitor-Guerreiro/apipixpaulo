export const credentials = {
  secret: process.env.BLACKCAT_SECRET_KEY || "", // BlackCat Secret Key
  public: process.env.BLACKCAT_PUBLIC_KEY || "", // BlackCat Public Key
};

// Credenciais BlackCat PAULO
export const blackCatCredentials = {
  apiUrl: "https://api.blackcatpagamentos.com/v1",
  secretKey: process.env.BLACKCAT_SECRET_KEY || "",
  publicKey: process.env.BLACKCAT_PUBLIC_KEY || "",
  webhookSecret: process.env.BLACKCAT_WEBHOOK_SECRET || "", // Para validar webhooks - configure conforme necessário
};

// Credenciais BlackCat do CLIENTE
export const clientBlackCatCredentials = {
  apiUrl: "https://api.blackcatpagamentos.com/v1",
  secretKey: process.env.BLACKCAT_CLIENT_SECRET_KEY || "",
  publicKey: process.env.BLACKCAT_CLIENT_PUBLIC_KEY || "",
};

// Credenciais para Allow Payments
export const allowPaymentsCredentials = {
  apiUrl: "https://api.allowpay.online/functions/v1", // URL correta da AllowPay
  secretKey: process.env.ALLOWPAY_SECRET_KEY || "", // Secret Key da AllowPay
  companyId: process.env.ALLOWPAY_COMPANY_ID || "", // Company ID da AllowPay
  webhookSecret: process.env.ALLOWPAY_WEBHOOK_SECRET || "", // Chave secreta para validar webhooks
};
