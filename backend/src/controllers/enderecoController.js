const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar endereços do usuário
const getUserAddresses = async (req, res) => {
	try {
		const userId = req.user.id;

		const addresses = await prisma.address.findMany({
			where: { userId },
			orderBy: { isDefault: 'desc' }
		});

		res.json(addresses);
	} catch (error) {
		console.error('Erro ao buscar endereços:', error);
		res.status(500).json({ message: 'Erro ao buscar endereços' });
	}
};

// Adicionar novo endereço
const addAddress = async (req, res) => {
	try {
		const userId = req.user.id;
		const {
			street,
			number,
			complement,
			neighborhood,
			city,
			state,
			zipcode,
			isDefault
		} = req.body;

		// Se este endereço for definido como padrão, remova o padrão dos outros
		if (isDefault) {
			await prisma.address.updateMany({
				where: { userId },
				data: { isDefault: false }
			});
		}

		const address = await prisma.address.create({
			data: {
				userId,
				street,
				number,
				complement,
				neighborhood,
				city,
				state,
				zipcode,
				isDefault: isDefault || false
			}
		});

		res.status(201).json(address);
	} catch (error) {
		console.error('Erro ao adicionar endereço:', error);
		res.status(500).json({ message: 'Erro ao adicionar endereço' });
	}
};

// Atualizar endereço existente
const updateAddress = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.id;
		const {
			street,
			number,
			complement,
			neighborhood,
			city,
			state,
			zipcode,
			isDefault
		} = req.body;

		// Verificar se o endereço pertence ao usuário
		const addressExists = await prisma.address.findFirst({
			where: { id: Number(id), userId }
		});

		if (!addressExists) {
			return res.status(404).json({ message: 'Endereço não encontrado' });
		}

		// Se este endereço for definido como padrão, remova o padrão dos outros
		if (isDefault) {
			await prisma.address.updateMany({
				where: { userId, NOT: { id: Number(id) } },
				data: { isDefault: false }
			});
		}

		const address = await prisma.address.update({
			where: { id: Number(id) },
			data: {
				street,
				number,
				complement,
				neighborhood,
				city,
				state,
				zipcode,
				isDefault: isDefault || false
			}
		});

		res.json(address);
	} catch (error) {
		console.error('Erro ao atualizar endereço:', error);
		res.status(500).json({ message: 'Erro ao atualizar endereço' });
	}
};

// Remover endereço
const removeAddress = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.id;

		// Verificar se o endereço pertence ao usuário
		const addressExists = await prisma.address.findFirst({
			where: { id: Number(id), userId }
		});

		if (!addressExists) {
			return res.status(404).json({ message: 'Endereço não encontrado' });
		}

		// Verificar se o endereço está sendo usado em algum pedido
		const orderWithAddress = await prisma.order.findFirst({
			where: { addressId: Number(id) }
		});

		if (orderWithAddress) {
			return res.status(400).json({
				message: 'Este endereço não pode ser removido pois está associado a pedidos'
			});
		}

		await prisma.address.delete({
			where: { id: Number(id) }
		});

		res.json({ message: 'Endereço removido com sucesso' });
	} catch (error) {
		console.error('Erro ao remover endereço:', error);
		res.status(500).json({ message: 'Erro ao remover endereço' });
	}
};

// Definir endereço como padrão
const setDefaultAddress = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user.id;

		// Verificar se o endereço pertence ao usuário
		const addressExists = await prisma.address.findFirst({
			where: { id: Number(id), userId }
		});

		if (!addressExists) {
			return res.status(404).json({ message: 'Endereço não encontrado' });
		}

		// Remover padrão de todos os endereços do usuário
		await prisma.address.updateMany({
			where: { userId },
			data: { isDefault: false }
		});

		// Definir o endereço selecionado como padrão
		const address = await prisma.address.update({
			where: { id: Number(id) },
			data: { isDefault: true }
		});

		res.json(address);
	} catch (error) {
		console.error('Erro ao definir endereço padrão:', error);
		res.status(500).json({ message: 'Erro ao definir endereço padrão' });
	}
};

module.exports = {
	getUserAddresses,
	addAddress,
	updateAddress,
	removeAddress,
	setDefaultAddress
};