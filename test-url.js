// Teste simples para verificar a URL da BlackCat
const { blackCatCredentials } = require('./src/models/api.ts');

console.log('URL da BlackCat:', blackCatCredentials.apiUrl);
console.log('URL completa:', `${blackCatCredentials.apiUrl}/transactions`);





