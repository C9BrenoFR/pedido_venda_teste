const fetch = require('node-fetch');

let authToken = null;
let tokenExpirationTime = null;
// Tokens necessários para autenticação
const ApplicationToken = '62ca18a8-aa3b-41b7-a54e-f669a437d326';
const CompanyToken = 'b5b984c5-cbfa-490b-8513-448fc67a39b6';


// Função para autenticar e obter o token
async function authenticate() {
  try {
    const response = await fetch('https://gateway-ng.dbcorp.com.br:55500/identidade-service/autenticar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://kidszone-ng.dbcorp.com.br'
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
    authToken = data.tokenAcesso; // Atualizado para tokenAcesso
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



async function fetchItemPriceListDetails(codgroup) {

      await checkToken();
    
      if (!authToken) {
        console.error('Erro: Token não obtido.');
        return;
      }
    
      try {
        const response = await fetch(`https://gateway-ng.dbcorp.com.br:55500/produto-service/item/lista-preco/${codgroup}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            'Origin': 'https://kidszone-ng.dbcorp.com.br'
          }
        });
    
        if (!response.ok) {
          throw new Error(`Erro ao buscar item da lista de preco: ${response.statusText}`);
        }
    
        const clientData = await response.json();
        console.log('dados lista precos recebidos:', clientData); // Log dos dados recebidos
    
        return clientData || []; // Retorna o array de pedidos
      } catch (error) {
        console.error('Erro ao buscar lista de preco 2:', error);
      }
    
}


setInterval(checkToken, 60 * 60 * 1000);  // Verifica o token a cada 1 hora



// Exportar as funções
module.exports = {
    authenticate,
    checkToken,
    fetchItemPriceListDetails

  };