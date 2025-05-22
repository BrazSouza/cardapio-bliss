// adminRoutes.js
// const express = require('express');
// const router = express.Router();
// const adminController = require('../controllers/adminController');
// const adminAuth = require('../middleware/adminAuth');
// const adminProdutosController = require('../controllers/adminProdutosController');
// const adminDashboardController = require('../controllers/adminDashboardController');

// // Aplicar middleware de autenticação de admin em todas as rotas
// router.use(adminAuth);

// // Rotas do dashboard administrativo
// router.get('/pedidos', adminController.listarPedidos);
// router.get('/pedidos/:id', adminController.detalhesPedido);
// router.put('/pedidos/:id/status', adminController.atualizarStatusPedido);

// // Rotas do dashboard
// router.get('/admin/estatisticas', adminDashboardController.getEstatisticas);
// router.get('/admin/dashboard/pedidos-por-hora', adminDashboardController.getPedidosPorHora);
// router.get('/admin/dashboard/faturamento-periodo', adminDashboardController.getFaturamentoPeriodo);

// // Rotas para gerenciamento de produtos para admin
// router.get('/produtos', adminProdutosController.listarProdutos);
// router.get('/produtos/:id', adminProdutosController.detalhesProduto);
// router.post('/produtos', adminProdutosController.criarProduto);
// router.put('/produtos/:id', adminProdutosController.atualizarProduto);
// router.delete('/produtos/:id', adminProdutosController.excluirProduto);

// Rotas para gerenciamento de categorias


// router.get('/categorias', adminController.listarCategorias);
// router.post('/categorias', adminController.criarCategoria);
// router.put('/categorias/:id', adminController.atualizarCategoria);
// router.delete('/categorias/:id', adminController.excluirCategoria);

// // Configurações
// router.get('/configuracoes', adminController.getConfiguracoes);
// router.put('/configuracoes', adminController.atualizarConfiguracoes);

module.exports = router;
