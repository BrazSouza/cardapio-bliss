const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar produtos favoritos do usuário
const getFavorites = async (req, res) => {
	try {
		const usuarioId = req.usuario.id;

		const usuario = await prisma.usuario.findUnique({
			where: { id: usuarioId },
			include: {
				favoritos: {
					include: {
						categoria: true
					}
				}
			}
		});

		res.json(usuario.favoritos);
	} catch (error) {
		console.error('Erro ao buscar favoritos:', error);
		res.status(500).json({ message: 'Erro ao buscar favoritos' });
	}
};

// Adicionar produto aos favoritos
const addFavorite = async (req, res) => {
	try {
		const usuarioId = req.usuario.id;
		const { produtoId } = req.body;

		// Verificar se o produto existe
		const produto = await prisma.produto.findUnique({
			where: { id: Number(produtoId) }
		});

		if (!produto) {
			return res.status(404).json({ message: 'Produto não encontrado' });
		}

		// Verificar se já está nos favoritos
		const exists = await prisma.usuario.findFirst({
			where: {
				id: usuarioId,
				favoritos: {
					some: {
						id: Number(produtoId)
					}
				}
			}
		});

		if (exists) {
			return res.status(400).json({ message: 'Produto já está nos favoritos' });
		}

		// Adicionar aos favoritos
		await prisma.usuario.update({
			where: { id: usuarioId },
			data: {
				favoritos: {
					connect: {
						id: Number(produtoId)
					}
				}
			}
		});

		res.status(201).json({ message: 'Produto adicionado aos favoritos' });
	} catch (error) {
		console.error('Erro ao adicionar favorito:', error);
		res.status(500).json({ message: 'Erro ao adicionar favorito' });
	}
};

// Remover produto dos favoritos
const removeFavorite = async (req, res) => {
	try {
		const usuarioId = req.usuario.id;
		const { produtoId } = req.params;

		// Remover dos favoritos
		await prisma.usuario.update({
			where: { id: usuarioId },
			data: {
				favoritos: {
					disconnect: {
						id: Number(produtoId)
					}
				}
			}
		});

		res.json({ message: 'Produto removido dos favoritos' });
	} catch (error) {
		console.error('Erro ao remover favorito:', error);
		res.status(500).json({ message: 'Erro ao remover favorito' });
	}
};

module.exports = {
	getFavorites,
	addFavorite,
	removeFavorite
};