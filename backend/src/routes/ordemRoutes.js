// ordemRoutes.js
const express = require('express');
const router = express.Router();
const ordemController = require('../controllers/ordemController');
const { autenticar } = require('../middleware/auth');

router.use(autenticar);

router.post('/', ordemController.criarPedido);
router.get('/', ordemController.getUserOrders);
router.get('/:id', ordemController.getOrderDetails);
router.patch('/:id/status', ordemController.updateOrderStatus);
router.post('/:id/cancel', ordemController.cancelOrder);

module.exports = router;
