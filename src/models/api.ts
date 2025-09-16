export const credentials = {
  secret: process.env.BLACKCAT_SECRET_KEY || "YOUR_BLACKCAT_SECRET_KEY", // BlackCat Secret Key
  public: process.env.BLACKCAT_PUBLIC_KEY || "YOUR_BLACKCAT_PUBLIC_KEY", // BlackCat Public Key
};

// Credenciais para BlackCat Pagamentos
export const blackCatCredentials = {
  apiUrl: "https://api.blackcatpagamentos.com/v1",
  secretKey: process.env.BLACKCAT_SECRET_KEY || "YOUR_BLACKCAT_SECRET_KEY",
  publicKey: process.env.BLACKCAT_PUBLIC_KEY || "YOUR_BLACKCAT_PUBLIC_KEY",
  webhookSecret: process.env.BLACKCAT_WEBHOOK_SECRET || "YOUR_BLACKCAT_WEBHOOK_SECRET", // Para validar webhooks - configure conforme necessário
};

// Credenciais para Allow Payments
export const allowPaymentsCredentials = {
  apiUrl: "https://api.allowpay.online/functions/v1", // URL correta da AllowPay
  secretKey: process.env.ALLOWPAY_SECRET_KEY || "YOUR_ALLOWPAY_SECRET_KEY", // Secret Key da AllowPay
  companyId: process.env.ALLOWPAY_COMPANY_ID || "YOUR_ALLOWPAY_COMPANY_ID", // Company ID da AllowPay
  webhookSecret: process.env.ALLOWPAY_WEBHOOK_SECRET || "YOUR_ALLOWPAY_WEBHOOK_SECRET", // Chave secreta para validar webhooks
};
