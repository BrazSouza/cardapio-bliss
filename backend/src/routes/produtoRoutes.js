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
router.get('/produtos', produtoController.getAllProducts);
router.get('/produtos/:id', produtoController.getProductById);
router.post('/produtos', produtoController.createProduct);
router.put('/produtos/:id', produtoController.updateProduct);
router.delete('/produtos/:id', produtoController.deleteProduct);
router.get('/categories/:categoriaId/produtos', produtoController.getProductsByCategory);

router.get('/', (req, res) => {
	res.json({ message: 'Burger, Refri, Açai, Pizza' });
});

// POST /api/produtos
router.post('/', (req, res) => {
	const { id, nome, preco, disponivel } = req.body;

	if (!id || !nome || !preco || disponivel === undefined) {
		return res.status(400).json({ error: 'Dados incompletos' });
	}

	// Simulação de salvar no banco de dados
	const novoProduto = { id, nome, preco, disponivel };

	console.log('Produto criado:', novoProduto);

	res.status(201).json({
		message: 'Produto criado com sucesso!',
		produto: novoProduto
	});
});


module.exports = router;