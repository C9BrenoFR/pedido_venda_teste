const apiServiceLogistica = require('../utils/apiServiceLogistica');

async function getInvoices(req, res) {

    const status = req.query.status || 1; // Usa status 6 como padrão
  
    console.log(`Recebendo notas para o status: ${status}`); // Log para depuração
  
    try {
      const invoices = await apiServiceLogistica.fetchInvoices(status);
      res.status(200).json(invoices);
    } catch (error) {
      console.error('Erro ao obter detalhes das notas fiscais:', error);
      res.status(500).send('Erro ao obter detalhes das notas fiscais');
    }
  }


  async function getClients(req, res) {
  
    try {
      const Clients = await apiServiceLogistica.fetchInvoiceClients();
      res.status(200).json(Clients);
    } catch (error) {
      console.error('Erro ao obter detalhes das notas fiscais:', error);
      res.status(500).send('Erro ao obter detalhes das notas fiscais');
    }
  }



  
  module.exports = { 
    getInvoices, 
    getClients

};