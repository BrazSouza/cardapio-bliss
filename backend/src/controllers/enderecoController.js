const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar endereços do usuário
const getUserAddresses = async (req, res) => {
	try {
		const usuarioId = req.usuario.id;

		const enderecos = await prisma.endereco.findMany({
			where: { usuarioId },
			orderBy: { padrao: 'desc' }
		});

		res.json(enderecos);
	} catch (error) {
		console.error('Erro ao buscar endereços:', error);
		res.status(500).json({ message: 'Erro ao buscar endereços' });
	}
};

// Adicionar novo endereço
const addAddress = async (req, res) => {
	try {
		const usuarioId = req.usuario.id;
		const {
			rua,
			numero,
			complemento,
			bairro,
			cidade,
			estado,
			cep,
			padrao
		} = req.body;

		// Se este endereço for definido como padrão, remova o padrão dos outros
		if (padrao) {
			await prisma.endereco.updateMany({
				where: { usuarioId },
				data: { padrao: false }
			});
		}

		const endereco = await prisma.endereco.create({
			data: {
				usuarioId,
				rua,
				numero,
				complemento,
				bairro,
				cidade,
				estado,
				cep,
				padrao: padrao || false
			}
		});

		res.status(201).json(endereco);
	} catch (error) {
		console.error('Erro ao adicionar endereço:', error);
		res.status(500).json({ message: 'Erro ao adicionar endereço' });
	}
};

// Atualizar endereço existente
const updateAddress = async (req, res) => {
	try {
		const { id } = req.params;
		const usuarioId = req.usuario.id;
		const {
			rua,
			numero,
			complemento,
			bairro,
			cidade,
			estado,
			cep,
			padrao
		} = req.body;

		// Verificar se o endereço pertence ao usuário
		const addressExists = await prisma.endereco.findFirst({
			where: { id: Number(id), usuarioId }
		});

		if (!addressExists) {
			return res.status(404).json({ message: 'Endereço não encontrado' });
		}

		// Se este endereço for definido como padrão, remova o padrão dos outros
		if (padrao) {
			await prisma.endereco.updateMany({
				where: { usuarioId, NOT: { id: Number(id) } },
				data: { padrao: false }
			});
		}

		const endereco = await prisma.endereco.update({
			where: { id: Number(id) },
			data: {
				rua,
				numero,
				complemento,
				bairro,
				cidade,
				estado,
				cep,
				padrao: padrao || false
			}
		});

		res.json(endereco);
	} catch (error) {
		console.error('Erro ao atualizar endereço:', error);
		res.status(500).json({ message: 'Erro ao atualizar endereço' });
	}
};

// Remover endereço
const removeAddress = async (req, res) => {
	try {
		const { id } = req.params;
		const usuarioId = req.usuario.id;

		// Verificar se o endereço pertence ao usuário
		const addressExists = await prisma.endereco.findFirst({
			where: { id: Number(id), usuarioId }
		});

		if (!addressExists) {
			return res.status(404).json({ message: 'Endereço não encontrado' });
		}

		// Verificar se o endereço está sendo usado em algum pedido
		const orderWithAddress = await prisma.pedido.findFirst({
			where: { enderecoId: Number(id) }
		});

		if (orderWithAddress) {
			return res.status(400).json({
				message: 'Este endereço não pode ser removido pois está associado a pedidos'
			});
		}

		await prisma.endereco.delete({
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
		const usuarioId = req.usuario.id;

		// Verificar se o endereço pertence ao usuário
		const addressExists = await prisma.endereco.findFirst({
			where: { id: Number(id), usuarioId }
		});

		if (!addressExists) {
			return res.status(404).json({ message: 'Endereço não encontrado' });
		}

		// Remover padrão de todos os endereços do usuário
		await prisma.endereco.updateMany({
			where: { usuarioId },
			data: { padrao: false }
		});

		// Definir o endereço selecionado como padrão
		const endereco = await prisma.endereco.update({
			where: { id: Number(id) },
			data: { padrao: true }
		});

		res.json(endereco);
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