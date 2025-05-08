const prisma = require('../utils/prisma');

// Lista todas as categorias
async function getAllCategories(req, res) {
	try {
		const categories = await prisma.categoria.findMany();
		return res.json(categories);
	} catch (error) {
		console.error('Erro ao listar categorias:', error);
		return res.status(500).json({ error: 'Erro ao listar categorias' });
	}
}

// Cria uma nova categoria
async function criarCategoria(req, res) {
	try {
		const { nome, descricao } = req.body;

		const categoria = await prisma.categoria.create({
			data: {
				nome,
				descricao,
			},
		});

		return res.status(201).json(categoria);
	} catch (error) {
		console.error('Erro ao criar categoria:', error);
		return res.status(500).json({ error: 'Erro ao criar categoria' });
	}
}

// Obtém uma categoria pelo ID
async function getCategoryById(req, res) {
	try {
		const { id } = req.params;

		const categoria = await prisma.categoria.findUnique({
			where: { id: Number(id) },
			include: {
				produtos: true,
			},
		});

		if (!categoria) {
			return res.status(404).json({ error: 'Categoria não encontrada' });
		}

		return res.json(categoria);
	} catch (error) {
		console.error('Erro ao buscar categoria:', error);
		return res.status(500).json({ error: 'Erro ao buscar categoria' });
	}
}

// Atualiza uma categoria
async function updateCategory(req, res) {
	try {
		const { id } = req.params;
		const { nome, descricao } = req.body;

		const categoria = await prisma.categoria.update({
			where: { id: Number(id) },
			data: {
				nome,
				descricao,
			},
		});

		return res.json(categoria);
	} catch (error) {
		console.error('Erro ao atualizar categoria:', error);
		return res.status(500).json({ error: 'Erro ao atualizar categoria' });
	}
}

// Remove uma categoria
async function deleteCategory(req, res) {
	try {
		const { id } = req.params;

		await prisma.categoria.delete({
			where: { id: Number(id) },
		});

		return res.json({ message: 'Categoria removida com sucesso' });
	} catch (error) {
		console.error('Erro ao remover categoria:', error);
		return res.status(500).json({ error: 'Erro ao remover categoria' });
	}
}

module.exports = {
	getAllCategories,
	criarCategoria,
	getCategoryById,
	updateCategory,
	deleteCategory,
};