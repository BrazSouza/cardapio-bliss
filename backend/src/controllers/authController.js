// controllers/authController.js
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { generateToken } = require('../utils/jwt');

const prisma = new PrismaClient();

// Registrar novo usuário
const register = async (req, res) => {
	try {
		const { name, email, password, phone } = req.body;

		// Verificar se usuário já existe
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return res.status(400).json({ message: 'Email já cadastrado' });
		}

		// Hash da senha
		const hashedPassword = await bcrypt.hash(password, 10);

		// Criar novo usuário
		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				phone,
			},
		});

		// Gerar token
		const token = generateToken(user.id);

		res.status(201).json({
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				phone: user.phone
			},
			token
		});
	} catch (error) {
		console.error('Erro ao registrar usuário:', error);
		res.status(500).json({ message: 'Erro ao registrar usuário' });
	}
};

// Login de usuário
const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Buscar usuário
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return res.status(401).json({ message: 'Credenciais inválidas' });
		}

		// Verificar senha
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ message: 'Credenciais inválidas' });
		}

		// Gerar token
		const token = generateToken(user.id);

		res.json({
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				phone: user.phone
			},
			token
		});
	} catch (error) {
		console.error('Erro ao fazer login:', error);
		res.status(500).json({ message: 'Erro ao fazer login' });
	}
};

// Obter perfil do usuário
const getProfile = async (req, res) => {
	try {
		res.json({
			user: {
				id: req.user.id,
				name: req.user.name,
				email: req.user.email,
				phone: req.user.phone
			}
		});
	} catch (error) {
		console.error('Erro ao buscar perfil:', error);
		res.status(500).json({ message: 'Erro ao buscar perfil' });
	}
};

module.exports = {
	register,
	login,
	getProfile
};