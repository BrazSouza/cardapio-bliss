const express = require('express');
const router = express.Router();
const favoritoController = require('../controllers/favoritoController');
const { autenticar } = require('../middleware/auth');

// Todas as rotas de favoritos são protegidas por autenticação
router.use(autenticar);

// Listar produtos favoritos
router.get('/', favoritoController.getFavorites);

// Adicionar produto aos favoritos
router.post('/', favoritoController.addFavorite);

// Remover produto dos favoritos
router.delete('/:produtoId', favoritoController.removeFavorite);

module.exports = router;