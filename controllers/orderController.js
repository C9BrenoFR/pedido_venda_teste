// controllers/orderController.js
const apiService = require('../utils/apiService');

async function getOrderDetails(req, res) {
  try {
    const orders = await apiService.fetchOrderDetails();
    console.log('JSON completo dos pedidos:', orders);

    res.status(200).json(orders);
  } catch (error) {
    console.error('Erro ao obter detalhes do pedido:', error);
    res.status(500).send('Erro ao obter detalhes do pedido');
  }
}

module.exports = { getOrderDetails };
