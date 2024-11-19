const express = require('express');
const path = require('path');
const pdfController = require('../controllers/pdfController');
const orderController = require('../controllers/orderController'); // Importa o controlador
const { authMiddleware, authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

// Rota para a página inicial
router.get('/', authMiddleware, (req, res) => {
    console.log('Rota / acessada');
    res.sendFile(path.resolve(__dirname, '..', 'views', 'index.html'));
});

// Rota para a página de login
router.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'views', 'login.html'));
});

// Rota para a página de login2
router.get('/login2', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'views', 'login2.html'));
});

// Rota para a página de administração
router.get('/admin', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'views', 'admin.html'));
});

// Rota para a página de pedidos comerciais (comercial.html)
router.get('/comercial', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'views', 'comercial.html'));
});


// Rota para a página de detalhes do pedido (detalhes.html)
router.get('/detalhes', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'detalhes.html'));
});


// Rotas da API de pedidos
router.get('/api/pedidos', orderController.getOrderDetails); // Pedidos com representantes
router.get('/api/pedidos/:id', orderController.getOrderDetailsById); // Detalhes do pedido por ID



// Rota para envio de PDF
router.post('/send-pdf', pdfController.sendPdf);

// Rota para autenticação
router.post('/auth', authenticateUser);

module.exports = router;
