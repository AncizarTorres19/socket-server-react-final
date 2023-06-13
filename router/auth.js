// Objetivo: Rutas de autenticación
// Path: api/login

const { Router } = require('express');

// Controllers
const { crearUsuario, revalidarToken, loginUsuario } = require('../controllers/auth');
const { check } = require('express-validator');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//Crear un nuevo usuario
router.post('/new', [
    //middlewares
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], crearUsuario);

//Login
router.post('/', [
    //middlewares
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], loginUsuario);

//Revalidar token
router.get('/renew', [
    //middlewares
    validarJWT
], revalidarToken);


module.exports = router;