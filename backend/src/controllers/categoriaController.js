const prisma = require('../utils/prisma');

// Lista todas as categorias
async function getAllCategories(req, res) {
	try {
		const categories = await prisma.category.findMany();
		return res.json(categories);
	} catch (error) {
		console.error('Erro ao listar categorias:', error);
		return res.status(500).json({ error: 'Erro ao listar categorias' });
	}
}

// Cria uma nova categoria
async function criarCategoria(req, res) {
	try {
		const { name, description } = req.body;

		const category = await prisma.category.create({
			data: {
				name,
				description,
			},
		});

		return res.status(201).json(category);
	} catch (error) {
		console.error('Erro ao criar categoria:', error);
		return res.status(500).json({ error: 'Erro ao criar categoria' });
	}
}

// Obtém uma categoria pelo ID
async function getCategoryById(req, res) {
	try {
		const { id } = req.params;

		const category = await prisma.category.findUnique({
			where: { id: Number(id) },
			include: {
				products: true,
			},
		});

		if (!category) {
			return res.status(404).json({ error: 'Categoria não encontrada' });
		}

		return res.json(category);
	} catch (error) {
		console.error('Erro ao buscar categoria:', error);
		return res.status(500).json({ error: 'Erro ao buscar categoria' });
	}
}

// Atualiza uma categoria
async function updateCategory(req, res) {
	try {
		const { id } = req.params;
		const { name, description } = req.body;

		const category = await prisma.category.update({
			where: { id: Number(id) },
			data: {
				name,
				description,
			},
		});

		return res.json(category);
	} catch (error) {
		console.error('Erro ao atualizar categoria:', error);
		return res.status(500).json({ error: 'Erro ao atualizar categoria' });
	}
}

// Remove uma categoria
async function deleteCategory(req, res) {
	try {
		const { id } = req.params;

		await prisma.category.delete({
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