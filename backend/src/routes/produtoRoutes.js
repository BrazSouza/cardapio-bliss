const express = require('express');
const categoriaController = require('../controllers/categoriaController');
const produtoController = require('../controllers/produtoController');

const router = express.Router();

// Rotas de categoria
router.get('/categories', categoriaController.getAllCategories);
router.get('/categories/:id', categoriaController.getCategoryById);
router.post('/categories', categoriaController.criarCategoria);
router.put('/categories/:id', categoriaController.updateCategory);
router.delete('/categories/:id', categoriaController.deleteCategory);

// Rotas de produto
router.get('/products', produtoController.getAllProducts);
router.get('/products/:id', produtoController.getProductById);
router.post('/products', produtoController.createProduct);
router.put('/products/:id', produtoController.updateProduct);
router.delete('/products/:id', produtoController.deleteProduct);
router.get('/categories/:categoryId/products', produtoController.getProductsByCategory);

module.exports = router;