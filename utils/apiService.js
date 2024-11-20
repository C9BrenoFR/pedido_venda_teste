const fetch = require('node-fetch');
const pLimit = require('p-limit');

let authToken = null;
let tokenExpirationTime = null;

// Função para autenticar e obter o token
async function authenticate() {
  try {
    const response = await fetch('https://homolog-gateway-ng.dbcorp.com.br:44400/identidade-service/autenticar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: 'alex.l', senha: '@Al@2313', origin: 'kidszone-ng' }),
    });

    if (!response.ok) throw new Error(`Erro na autenticação: ${response.statusText}`);

    const data = await response.json();
    authToken = data.tokenAcesso;
    tokenExpirationTime = Date.now() + 2 * 60 * 60 * 1000; // 2 horas de validade
    console.log('Autenticado com sucesso, token obtido.');
  } catch (error) {
    console.error('Erro ao autenticar:', error);
  }
}

// Função para verificar se o token está válido ou renovar
async function checkToken() {
  if (!authToken || Date.now() > tokenExpirationTime) {
    console.log('Token expirado ou inexistente. Autenticando...');
    await authenticate();
  }
}

// Função para buscar os pedidos de venda em lotes
async function fetchOrderDetails(status = 6, maxRecords = 100) {
  await checkToken();

  if (!authToken) {
    console.error('Erro: Token não obtido.');
    return [];
  }

  const pageSize = 20; // Tamanho do lote
  let pageNumber = 1;
  let totalFetched = 0;
  let allOrders = [];

  try {
    while (totalFetched < maxRecords) {
      console.log(`Buscando página ${pageNumber} com tamanho ${pageSize}`);

      const response = await fetch(
        `https://homolog-gateway-ng.dbcorp.com.br:44400/vendas-service/pedido?PageNumber=${pageNumber}&PageSize=${pageSize}&status=${status}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar pedidos na página ${pageNumber}: ${response.statusText}`);
      }

      const ordersData = await response.json();

      if (ordersData.dados && ordersData.dados.length > 0) {
        allOrders = [...allOrders, ...ordersData.dados];
        totalFetched += ordersData.dados.length;
        console.log(`Total de pedidos acumulados: ${totalFetched}`);
      }

      if (ordersData.dados.length < pageSize) break;

      pageNumber++;
    }

    return allOrders.slice(0, maxRecords); // Retorna os registros necessários
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return [];
  }
}

// Função para buscar representantes para cada cliente
async function fetchOrdersWithRepresentatives(status = 6) {
  const orders = await fetchOrderDetails(status);

  const representativeEndpoint = 'https://homolog-gateway-ng.dbcorp.com.br:44400/pessoa-service/representante/cliente/';
  const limit = pLimit(5); // Limita a 5 requisições simultâneas

  const ordersWithRepresentatives = await Promise.all(
    orders.map((order) =>
      limit(async () => {
        try {
          const response = await fetch(`${representativeEndpoint}${order.cliente.codigo}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          });

          const repData = await response.json();
          return { ...order, representante: repData[0] || null };
        } catch (error) {
          console.error(`Erro ao buscar representante para cliente ${order.cliente.codigo}:`, error);
          return { ...order, representante: null };
        }
      })
    )
  );

  return ordersWithRepresentatives;
}

// Função para buscar detalhes dos pedidos
async function fetchOrdersWithdetailsAndRepresentatives(status = 6) {
  const ordersWithRepresentatives = await fetchOrdersWithRepresentatives(status);

  const orderDetailsEndpoint = 'https://homolog-gateway-ng.dbcorp.com.br:44400/vendas-service/pedido/';
  const limit = pLimit(5); // Limita a 5 requisições simultâneas

  const ordersWithDetails = await Promise.all(
    ordersWithRepresentatives.map((order) =>
      limit(async () => {
        try {
          const response = await fetch(`${orderDetailsEndpoint}${order.id}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`Erro ao buscar detalhes do pedido ${order.id}: ${response.statusText}`);
          }

          const details = await response.json();
          return { ...order, detalhes: details };
        } catch (error) {
          console.error(`Erro ao buscar detalhes do pedido ${order.id}:`, error);
          return { ...order, detalhes: null };
        }
      })
    )
  );

  return ordersWithDetails;
}

// Função para buscar transportadoras e enriquecer pedidos
async function fetchOrdersWithdetailsAndRepresentativesWithTransport(status = 6) {
  const ordersWithDetails = await fetchOrdersWithdetailsAndRepresentatives(status);

  const transportEndpoint = 'https://homolog-gateway-ng.dbcorp.com.br:44400/pessoa-service/transportadora/codigo/';
  const limit = pLimit(5); // Limita a 5 requisições simultâneas

  const ordersWithTransport = await Promise.all(
    ordersWithDetails.map((order) =>
      limit(async () => {
        try {
          const response = await fetch(`${transportEndpoint}${order.transportadoraCodigo}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`Erro ao buscar detalhes da transportadora ${order.transportadoraCodigo}: ${response.statusText}`);
          }

          const transportDetails = await response.json();
          return { ...order, detalhes_transporte: transportDetails };
        } catch (error) {
          console.error(`Erro ao buscar detalhes da transportadora ${order.transportadoraCodigo}:`, error);
          return { ...order, detalhes_transporte: null };
        }
      })
    )
  );

  return ordersWithTransport;
}

// Função para buscar detalhes de um pedido específico pelo ID
async function fetchOrderDetailsById(id, status = 6) {
  await checkToken();

  if (!authToken) {
    console.error('Erro: Token não obtido.');
    return null;
  }

  try {
    const response = await fetch(
      `https://homolog-gateway-ng.dbcorp.com.br:44400/vendas-service/pedido/${id}?status=${status}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) throw new Error(`Erro ao buscar detalhes do pedido com ID ${id}: ${response.statusText}`);

    const orderDetails = await response.json();
    console.log(`Detalhes do pedido ${id} carregados com sucesso.`);
    return orderDetails;
  } catch (error) {
    console.error(`Erro ao buscar detalhes do pedido com ID ${id}:`, error);
    throw error;
  }
}

// Exportar funções
module.exports = {
  authenticate,
  checkToken,
  fetchOrderDetails,
  fetchOrdersWithRepresentatives,
  fetchOrdersWithdetailsAndRepresentatives,
  fetchOrdersWithdetailsAndRepresentativesWithTransport,
  fetchOrderDetailsById,
};
