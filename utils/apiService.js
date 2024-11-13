const fetch = require('node-fetch');

let authToken = null;
let tokenExpirationTime = null;

// Função para autenticar e obter o token
async function authenticate() {
  try {
    const response = await fetch('https://homolog-gateway-ng.dbcorp.com.br:44400/identidade-service/autenticar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usuario: "alex.l",
        senha: "@Al@2313",
        origin: "kidszone-ng"
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na autenticação: ${response.statusText}`);
    }

    const data = await response.json();
    authToken = data.tokenAcesso; // Verifique se o campo correto é 'token'
    tokenExpirationTime = Date.now() + 2 * 60 * 60 * 1000;
    console.log('Autenticado com sucesso, token obtido.');
  } catch (error) {
    console.error('Erro ao autenticar:', error);
  }
}

// Função para verificar se o token está válido ou se precisamos renovar
async function checkToken() {
  if (!authToken || Date.now() > tokenExpirationTime) {
    console.log('Token expirado ou inexistente. Autenticando...');
    await authenticate();
  }
}

// Função para buscar detalhes dos pedidos de venda
async function fetchOrderDetails() {
  await checkToken();

  if (!authToken) {
    console.error('Erro: Token não obtido.');
    return;
  }

  try {
    const response = await fetch('https://homolog-gateway-ng.dbcorp.com.br:44400/vendas-service/pedido?status=6', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar pedidos: ${response.statusText}`);
    }

    const ordersData = await response.json();
    console.log('Pedidos obtidos com sucesso:', ordersData);
    return ordersData;
  } catch (error) {
    console.error('Erro ao buscar detalhes do pedido:', error);
  }
}

// Exportar as funções
module.exports = {
  authenticate,
  checkToken,
  fetchOrderDetails
};
