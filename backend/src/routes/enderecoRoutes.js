// const express = require('express');
// const router = express.Router();
// const enderecoController = require('../controllers/enderecoController');
// const { verificarAutenticacao } = require('../middleware/auth');

// // Todas as rotas de endereço são protegidas por autenticação
// router.use(auth);

// // Listar endereços do usuário
// router.get('/', enderecoController.getUserAddresses);

// // Adicionar novo endereço
// router.post('/', enderecoController.addAddress);

// // Atualizar endereço existente
// router.put('/:id', enderecoController.updateAddress);

// // Remover endereço
// router.delete('/:id', enderecoController.removeAddress);

// // Definir endereço como padrão
// router.patch('/:id/default', enderecoController.setDefaultAddress);

// module.exports = router;


const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/enderecoController');
const { autenticar } = require('../middleware/auth');

// Proteger todas as rotas
router.use(autenticar);

router.post('/', enderecoController.addAddress);
router.get('/', enderecoController.getUserAddresses);
router.put('/:id', enderecoController.updateAddress);
router.patch('/:id/default', enderecoController.setDefaultAddress);
router.delete('/:id', enderecoController.removeAddress);

module.exports = router;
