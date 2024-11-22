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

// Função para calcular as datas de início e fim (últimos 30 dias)
function getLast30Days() {
  const hoje = new Date();
  const dataFim = hoje.toISOString().split('T')[0]; // Data de hoje no formato YYYY-MM-DD
  const dataInicio = new Date(hoje.setDate(hoje.getDate() - 30)).toISOString().split('T')[0]; // Data 30 dias atrás
  return { dataInicio, dataFim };
}



async function fetchClients() {
  await checkToken();

  if (!authToken) {
    console.error('Erro: Token não obtido.');
    return;
  }

  try {
    const response = await fetch(`https://homolog-gateway-ng.dbcorp.com.br:44400/pessoa-service/cliente`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar clientes: ${response.statusText}`);
    }

    const ClientsData = await response.json();
    console.log('Clientes recebidos:', ClientsData); // Log dos dados recebidos

    // Filtrar apenas os clientes ativos e não suspensos
    const filteredClients = ClientsData.filter(client => client.ativo === true && client.suspenso === false && client.status === 0);
    console.log('Clientes filtrados:', filteredClients); // Log dos dados filtrados

    return filteredClients; // Retorna apenas os clientes filtrados
  } catch (error) {
    console.error('Erro ao buscar detalhes dos clientes:', error);
  }
}



async function fetchInvoiceClients() {
  await checkToken();

  if (!authToken) {
    console.error('Erro: Token não obtido.');
    return;
  }

  const orders = await fetchClients() ;  

  const endpointClient = 'https://homolog-gateway-ng.dbcorp.com.br:44400/documentos-fiscais-service/nota-fiscal/cliente/'

  const InvoiceClients = await Promise.all(

    orders.map(async (order) => { 

      try {
        const response = await fetch(`${endpointClient}${order.codigo}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
    
        if (!response.ok) {
          throw new Error(`Erro ao buscar notas fiscais: ${response.statusText}`);
        }

        const clientsDetails = await response.json();
        return {
          ...order,
          detalhes_clientes : clientsDetails,
        };  
    
      } catch (error) {
        console.error('Erro ao buscar detalhes da notas fiscais:', error);
        return {
          ...order,
          detalhes_clientes: null, // Caso haja erro, atribui null aos detalhes
        };
      }

    })

  );
   return InvoiceClients
 
}





























async function fetchInvoices(status = 1) {
    await checkToken();
  
    if (!authToken) {
      console.error('Erro: Token não obtido.');
      return;
    }
  
    // Calcula as datas dinamicamente
    const { dataInicio, dataFim } = getLast30Days();
     
    console.log(`Buscando pedidos com status: ${status}, DataPedidoInicio: ${dataInicio}, DataPedidoFim: ${dataFim}`);
  
  
    try {
      const response = await fetch(`https://homolog-gateway-ng.dbcorp.com.br:44400/documentos-fiscais-service/nota-fiscal?DataInicio=${dataInicio}&DataFim=${dataFim}&status=${status}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Erro ao buscar notas fiscais: ${response.statusText}`);
      }
  
      const ordersData = await response.json();
      console.log('Notas fiscais recebidas:', ordersData); // Log dos dados recebidos
  
      return ordersData.dados || []; // Retorna o array de pedidos
    } catch (error) {
      console.error('Erro ao buscar detalhes da notas fiscais:', error);
    }
  }

  setInterval(checkToken, 60 * 60 * 1000);  // Verifica o token a cada 1 hora
 
  // Exportar as funções
module.exports = {
    authenticate,
    checkToken,
    fetchClients,
    fetchInvoiceClients,
    fetchInvoices,
  
  };