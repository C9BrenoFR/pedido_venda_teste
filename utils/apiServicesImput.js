const fetch = require('node-fetch');

let authToken = null;
let tokenExpirationTime = null;

// Função para autenticar e obter o token
async function authenticateImput() {
  try {
    const response = await fetch('http://homolog-kidszone-api-integracao.dbcorp.com.br/v1/Login/Auhenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
            "UsuNome": "erick.a",
            "UsuSenha": "@231312",
            "EmpId": 2,
            "VersaoSistema": "V3r1.34.0"
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
async function checkTokenImput() {
    if (!authToken || Date.now() > tokenExpirationTime) {
      console.log('Token expirado ou inexistente. Autenticando...');
      await authenticate();
    }
  }

// Função para imputar pedido de venda

async function OrdersImput() {
    try {
        const response = await fetch(`http://homolog-kidszone-api-integracao.dbcorp.com.br/v1/PedidoVenda/Incluir`,{

                method: 'POST',
                headers: {
                        'content-Type': 'application/json', 
                         },

                body: JSON.stringify({
                    "ListaPrecoId": 0,
                    "CondicaoPagamentoId": 0,
                    "FormaPagamentoId": 0,
                    "ValorDesconto": 0,
                    "PercentualDesconto": 0,
                    "ItensPedidoVenda": [
                        {
                        "ItemValorDesconto": 0,
                        "ItemPercentualDesconto": 0,
                        "EntregasItemPedidoVenda": [
                            {
                            "Data": "2024-12-19T12:17:32.313Z",
                            "DataPrevista": "2024-12-19T12:17:32.313Z",
                            "Quantidade": 0
                            }
                        ],
                        "ItemId": 0,
                        "Quantidade": 0
                        }
                    ],
                    "RepresentantesPedidoVendas": [
                        {
                        "RepresentanteId": 0,
                        "RepresentantePrincipal": true,
                        "PercentualComissaoItem": 0,
                        "PercentualComissaoServico": 0
                        }
                    ],
                    "ClienteId": 0,
                    "ContatoClienteId": 0,
                    "NumeroReferencia": "string",
                    "Observacao": "string"
                })
        })
    } catch (error) {
        console.error('Erro ao incluir pedido:', error);
    }
}


  setInterval(checkTokenImput, 60 * 60 * 1000);  // Verifica o token a cada 1 hora

  module.exports = { 
    authenticateImput,
    checkTokenImput,
    OrdersImput
  }









  
