const apiService = require('../utils/apiService');

async function getOrderDetails(req, res) {

  const status = req.query.status || 6; // Usa status 6 como padrão

  console.log(`Recebendo pedidos para o status: ${status}`); // Log para depuração

  try {
    const ordersWithDetailsAndRepresentatives = await apiService.fetchOrdersWithdetailsAndRepresentativesWithTransport(status);
    res.status(200).json(ordersWithDetailsAndRepresentatives);
  } catch (error) {
    console.error('Erro ao obter detalhes dos pedidos com representantes:', error);
    res.status(500).send('Erro ao obter detalhes dos pedidos com representantes');
  }
}

module.exports = { getOrderDetails };
