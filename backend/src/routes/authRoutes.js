// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { autenticar } = require('../middleware/auth');


// Apenas rotas que existem no controller
router.post('/login', authController.login);
router.post('/criar-admin', authController.criarAdmin); // Se quiser manter a criação
// router.post('/setup-admin', authController.setupAdminUser);



// Remova ou comente estas até implementar
// router.post('/register', authController.register);
// router.get('/profile', verificarAutenticacao, authController.getProfile);

// Rota protegida para verificar token atual
router.get('/verificar', autenticar, authController.verificarToken);


// Rota para criar administrador (desenvolvimento apenas)
// Em produção, esta rota deve ser desativada ou altamente protegida
router.post('/criar-admin', authController.criarAdmin);

;

module.exports = router;

