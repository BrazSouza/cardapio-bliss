const express = require('express');
const router = express.Router();
const favoritoController = require('../controllers/favoritoController');
const auth = require('../middleware/auth');

// Todas as rotas de favoritos são protegidas por autenticação
router.use(auth);

// Listar produtos favoritos
router.get('/', favoritoController.getFavorites);

// Adicionar produto aos favoritos
router.post('/', favoritoController.addFavorite);

// Remover produto dos favoritos
router.delete('/:productId', favoritoController.removeFavorite);

module.exports = router;