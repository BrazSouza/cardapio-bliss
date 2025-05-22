// authController.js - VERSÃO CORRIGIDA
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

exports.registro = async (req, res) => {
	console.log('Dados recebidos no backend:', req.body);

	try {
		const { nome, email, senha, telefone, endereco } = req.body;

		// Verificar se usuário já existe
		const usuarioExistente = await prisma.usuario.findUnique({
			where: { email }
		});

		if (usuarioExistente) {
			return res.status(400).json({ mensagem: 'Email já cadastrado' });
		}

		// Criar hash da senha
		const hashSenha = await bcrypt.hash(senha, 10);

		// Criar usuário
		const usuario = await prisma.usuario.create({
			data: {
				nome,
				email,
				senha: hashSenha,
				telefone,
				endereco
			}
		});

		// Gerar token
		const token = jwt.sign(
			{ id: usuario.id, email: usuario.email },
			process.env.JWT_SECRET,
			{ expiresIn: '24h' }
		);

		res.status(201).json({
			mensagem: 'Usuário registrado com sucesso',
			token,
			usuario: {
				id: usuario.id,
				nome: usuario.nome,
				email: usuario.email
			}
		});
	} catch (erro) {
		console.error('Erro ao registrar:', erro);
		res.status(500).json({ mensagem: 'Erro ao registrar usuário' });
	}
};

exports.login = async (req, res) => {
	console.log('Dados recebidos no login:', req.body);

	try {
		const { nome, telefone } = req.body;

		if (!nome || !telefone) {
			return res.status(400).json({ mensagem: 'Nome e telefone são obrigatórios' });
		}

		// Formatar o telefone para garantir que estamos procurando no formato correto
		const telefoneLimpo = telefone.replace(/\D/g, '');

		console.log('Buscando usuário com:', {
			nome: nome.trim(),
			telefone: telefoneLimpo
		});

		// Buscar usuário com base no nome e telefone
		const usuario = await prisma.usuario.findFirst({
			where: {
				telefone: telefoneLimpo
			}
		});

		if (!usuario) {
			return res.status(401).json({ mensagem: 'Telefone não encontrado' });
		}

		if (!usuario.nome.toLowerCase().includes(nome.trim().toLowerCase())) {
			return res.status(401).json({ mensagem: 'Nome incorreto' });
		}


		console.log('Usuário encontrado:', usuario);

		if (!usuario) {
			return res.status(401).json({ mensagem: 'Credenciais inválidas' });
		}

		// Gerar token
		const token = jwt.sign(
			{ id: usuario.id, nome: usuario.nome },
			process.env.JWT_SECRET || 'sua_chave_secreta_temporaria', // Fallback para testes
			{ expiresIn: '24h' }
		);

		res.json({
			mensagem: 'Login realizado com sucesso',
			token,
			usuario: {
				id: usuario.id,
				nome: usuario.nome,
				telefone: usuario.telefone
			}
		});
	} catch (erro) {
		console.error('Erro ao fazer login:', erro);
		res.status(500).json({ mensagem: 'Erro ao fazer login', error: erro.message });
	}
};

exports.verificarAutenticacao = async (req, res) => {
	res.status(200).json({
		mensagem: 'Autenticado',
		usuario: req.usuario
	});
};