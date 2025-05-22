const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rota para criar um novo usuário
router.post('/', usuarioController.criarUsuario);

// Rota para obter dados de um usuário específico
router.get('/:id', usuarioController.obterUsuario);

// Rota para atualizar dados de um usuário específico
router.put('/:id', usuarioController.atualizarUsuario);

module.exports = router;