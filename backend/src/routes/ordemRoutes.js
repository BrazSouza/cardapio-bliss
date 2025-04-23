
const express = require('express');
const router = express.Router();
const ordemController = require('../controllers/ordemController');
const auth = require('../middleware/auth');

// Todas as rotas de pedidos são protegidas por autenticação
router.use(auth);

// Criar um novo pedido
router.post('/', ordemController.criarPedido);

// Listar todos os pedidos do usuário
router.get('/', ordemController.getUserOrders);

// Obter detalhes de um pedido específico
router.get('/:id', ordemController.getOrderDetails);

// Nota: Isso assumirá que temos um middleware para verificar se o usuário é admin
router.patch('/:id/status', ordemController.updateOrderStatus);

// Cancelar pedido (disponível para o cliente)
router.post('/:id/cancel', ordemController.cancelOrder);


module.exports = router;