const prisma = require('../utils/prisma');

// Lista todos os produtos
async function getAllProducts(req, res) {
	try {
		const products = await prisma.product.findMany({
			include: {
				category: true,
			},
		});
		return res.json(products);
	} catch (error) {
		console.error('Erro ao listar produtos:', error);
		return res.status(500).json({ error: 'Erro ao listar produtos' });
	}
}

// Cria um novo produto
async function createProduct(req, res) {
	try {
		const { name, description, price, imageUrl, available, categoryId } = req.body;

		const product = await prisma.product.create({
			data: {
				name,
				description,
				price: parseFloat(price),
				imageUrl,
				available: Boolean(available),
				categoryId: Number(categoryId),
			},
		});

		return res.status(201).json(product);
	} catch (error) {
		console.error('Erro ao criar produto:', error);
		return res.status(500).json({ error: 'Erro ao criar produto' });
	}
}

// Obtém um produto pelo ID
async function getProductById(req, res) {
	try {
		const { id } = req.params;

		const product = await prisma.product.findUnique({
			where: { id: Number(id) },
			include: {
				category: true,
			},
		});

		if (!product) {
			return res.status(404).json({ error: 'Produto não encontrado' });
		}

		return res.json(product);
	} catch (error) {
		console.error('Erro ao buscar produto:', error);
		return res.status(500).json({ error: 'Erro ao buscar produto' });
	}
}

// Atualiza um produto
async function updateProduct(req, res) {
	try {
		const { id } = req.params;
		const { name, description, price, imageUrl, available, categoryId } = req.body;

		const product = await prisma.product.update({
			where: { id: Number(id) },
			data: {
				name,
				description,
				price: parseFloat(price),
				imageUrl,
				available: Boolean(available),
				categoryId: Number(categoryId),
			},
		});

		return res.json(product);
	} catch (error) {
		console.error('Erro ao atualizar produto:', error);
		return res.status(500).json({ error: 'Erro ao atualizar produto' });
	}
}

// Remove um produto
async function deleteProduct(req, res) {
	try {
		const { id } = req.params;

		await prisma.product.delete({
			where: { id: Number(id) },
		});

		return res.json({ message: 'Produto removido com sucesso' });
	} catch (error) {
		console.error('Erro ao remover produto:', error);
		return res.status(500).json({ error: 'Erro ao remover produto' });
	}
}

// Lista produtos por categoria
async function getProductsByCategory(req, res) {
	try {
		const { categoryId } = req.params;

		const products = await prisma.product.findMany({
			where: {
				categoryId: Number(categoryId),
			},
			include: {
				category: true,
			},
		});

		return res.json(products);
	} catch (error) {
		console.error('Erro ao listar produtos por categoria:', error);
		return res.status(500).json({ error: 'Erro ao listar produtos por categoria' });
	}
}

module.exports = {
	getAllProducts,
	createProduct,
	getProductById,
	updateProduct,
	deleteProduct,
	getProductsByCategory,
};