const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar produtos favoritos do usuário
const getFavorites = async (req, res) => {
	try {
		const userId = req.user.id;

		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: {
				favorites: {
					include: {
						category: true
					}
				}
			}
		});

		res.json(user.favorites);
	} catch (error) {
		console.error('Erro ao buscar favoritos:', error);
		res.status(500).json({ message: 'Erro ao buscar favoritos' });
	}
};

// Adicionar produto aos favoritos
const addFavorite = async (req, res) => {
	try {
		const userId = req.user.id;
		const { productId } = req.body;

		// Verificar se o produto existe
		const product = await prisma.product.findUnique({
			where: { id: Number(productId) }
		});

		if (!product) {
			return res.status(404).json({ message: 'Produto não encontrado' });
		}

		// Verificar se já está nos favoritos
		const exists = await prisma.user.findFirst({
			where: {
				id: userId,
				favorites: {
					some: {
						id: Number(productId)
					}
				}
			}
		});

		if (exists) {
			return res.status(400).json({ message: 'Produto já está nos favoritos' });
		}

		// Adicionar aos favoritos
		await prisma.user.update({
			where: { id: userId },
			data: {
				favorites: {
					connect: {
						id: Number(productId)
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
		const userId = req.user.id;
		const { productId } = req.params;

		// Remover dos favoritos
		await prisma.user.update({
			where: { id: userId },
			data: {
				favorites: {
					disconnect: {
						id: Number(productId)
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