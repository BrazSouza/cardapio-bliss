const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const criarUsuario = async (req, res) => {
	const { nome, telefone, endereco } = req.body;

	if (!nome || !telefone || !endereco) {
		return res.status(400).json({
			mensagem: 'Nome, telefone e endereço são obrigatórios.'
		});
	}

	// Validação de telefone (11 dígitos, apenas números)
	const telefoneLimpo = telefone.replace(/\D/g, '');
	if (!/^\d{11}$/.test(telefoneLimpo)) {
		return res.status(400).json({
			mensagem: 'O número de telefone deve conter 11 dígitos numéricos (DDD + número).'
		});
	}

	const { bairro, rua, cidade, numero, complemento } = endereco;
	if (!bairro || !rua || !cidade || !numero) {
		return res.status(400).json({
			mensagem: 'Todos os campos do endereço são obrigatórios (exceto complemento).'
		});
	}

	try {
		const novoUsuario = await prisma.usuario.create({
			data: {
				nome,
				telefone: telefoneLimpo,
				bairro,
				rua,
				cidade,
				numero,
				complemento: complemento || ''
			}
		});

		res.status(201).json({
			mensagem: 'Usuário criado com sucesso!',
			usuario: novoUsuario
		});
	} catch (error) {
		console.error('Erro ao criar usuário:', error);
		res.status(500).json({ mensagem: 'Erro ao criar usuário. Tente novamente mais tarde.' });
	}
};

// Novo método para obter dados do usuário pelo ID
const obterUsuario = async (req, res) => {
	const { id } = req.params;

	try {
		const usuario = await prisma.usuario.findUnique({
			where: { id: Number(id) }
		});

		if (!usuario) {
			return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
		}

		res.status(200).json({ usuario });
	} catch (error) {
		console.error('Erro ao buscar usuário:', error);
		res.status(500).json({ mensagem: 'Erro ao buscar usuário. Tente novamente mais tarde.' });
	}
};

// Novo método para atualizar dados do usuário
const atualizarUsuario = async (req, res) => {
	const { id } = req.params;
	const { nome, telefone, bairro, rua, cidade, numero, complemento } = req.body;

	// Validações básicas
	if (!nome || !telefone || !bairro || !rua || !cidade || !numero) {
		return res.status(400).json({
			mensagem: 'Nome, telefone e campos de endereço são obrigatórios (exceto complemento).'
		});
	}

	// Validação de telefone
	const telefoneLimpo = telefone.replace(/\D/g, '');
	if (!/^\d{11}$/.test(telefoneLimpo)) {
		return res.status(400).json({
			mensagem: 'O número de telefone deve conter 11 dígitos numéricos (DDD + número).'
		});
	}

	try {
		const usuarioAtualizado = await prisma.usuario.update({
			where: { id: Number(id) },
			data: {
				nome,
				telefone: telefoneLimpo,
				bairro,
				rua,
				cidade,
				numero,
				complemento: complemento || ''
			}
		});

		res.status(200).json({
			mensagem: 'Usuário atualizado com sucesso!',
			usuario: usuarioAtualizado
		});
	} catch (error) {
		console.error('Erro ao atualizar usuário:', error);
		res.status(500).json({ mensagem: 'Erro ao atualizar usuário. Tente novamente mais tarde.' });
	}
};

module.exports = {
	criarUsuario,
	obterUsuario,
	atualizarUsuario
};