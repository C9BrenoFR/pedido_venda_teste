const apiService = require('../utils/apiService');

async function getOrderDetails(req, res) {
  try {
    const ordersWithDetailsAndRepresentatives = await apiService.fetchOrdersWithdetailsAndRepresentativesWithTransport();
    res.status(200).json(ordersWithDetailsAndRepresentatives);
  } catch (error) {
    console.error('Erro ao obter detalhes dos pedidos com representantes:', error);
    res.status(500).send('Erro ao obter detalhes dos pedidos com representantes');
  }
}

module.exports = { getOrderDetails };
