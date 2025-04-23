const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/enderecoController');
const auth = require('../middleware/auth');

// Todas as rotas de endereço são protegidas por autenticação
router.use(auth);

// Listar endereços do usuário
router.get('/', enderecoController.getUserAddresses);

// Adicionar novo endereço
router.post('/', enderecoController.addAddress);

// Atualizar endereço existente
router.put('/:id', enderecoController.updateAddress);

// Remover endereço
router.delete('/:id', enderecoController.removeAddress);

// Definir endereço como padrão
router.patch('/:id/default', enderecoController.setDefaultAddress);

module.exports = router;