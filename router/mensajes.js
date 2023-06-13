//Path: /api/mensajes

const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

const { getMensajes, getChatById, createMensaje, updateMensaje, deleteMensaje } = require('../controllers/mensajes');

// router.get('/', getMensajes);

router.get('/:de', validarJWT, getChatById);

// router.post('/', createMensaje);

// router.put('/:id', updateMensaje);

// router.delete('/:id', deleteMensaje);

module.exports = router;



