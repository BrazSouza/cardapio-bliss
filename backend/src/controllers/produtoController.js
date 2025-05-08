const prisma = require('../utils/prisma');

// Lista todos os produtos
async function getAllProducts(req, res) {
	try {
		const produtos = await prisma.produto.findMany({
			include: {
				categoria: true,
			},
		});
		return res.json(produtos);
	} catch (error) {
		console.error('Erro ao listar produtos:', error);
		return res.status(500).json({ error: 'Erro ao listar produtos' });
	}
}

// Cria um novo produto
async function createProduct(req, res) {
	try {
		const { nome, descricao, preco, imagemUrl, disponivel, categoriaId } = req.body;

		const produto = await prisma.produto.create({
			data: {
				nome,
				descricao,
				preco: parseFloat(preco),
				imagemUrl,
				disponivel: Boolean(disponivel),
				categoriaId: Number(categoriaId),
			},
		});

		return res.status(201).json(produto);
	} catch (error) {
		console.error('Erro ao criar produto:', error);
		return res.status(500).json({ error: 'Erro ao criar produto' });
	}
}

// Obtém um produto pelo ID
async function getProductById(req, res) {
	try {
		const { id } = req.params;

		const produto = await prisma.produto.findUnique({
			where: { id: Number(id) },
			include: {
				categoria: true,
			},
		});

		if (!produto) {
			return res.status(404).json({ error: 'Produto não encontrado' });
		}

		return res.json(produto);
	} catch (error) {
		console.error('Erro ao buscar produto:', error);
		return res.status(500).json({ error: 'Erro ao buscar produto' });
	}
}

// Atualiza um produto
async function updateProduct(req, res) {
	try {
		const { id } = req.params;
		const { nome, descricao, preco, imagemUrl, disponivel, categoriaId } = req.body;

		const produto = await prisma.produto.update({
			where: { id: Number(id) },
			data: {
				nome,
				descricao,
				preco: parseFloat(preco),
				imagemUrl,
				disponivel: Boolean(disponivel),
				categoriaId: Number(categoriaId),
			},
		});

		return res.json(produto);
	} catch (error) {
		console.error('Erro ao atualizar produto:', error);
		return res.status(500).json({ error: 'Erro ao atualizar produto' });
	}
}

// Remove um produto
async function deleteProduct(req, res) {
	try {
		const { id } = req.params;

		await prisma.produto.delete({
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
		const { categoriaId } = req.params;

		const produtos = await prisma.produto.findMany({
			where: {
				categoriaId: Number(categoriaId),
			},
			include: {
				categoria: true,
			},
		});

		return res.json(produtos);
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