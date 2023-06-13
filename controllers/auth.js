
const { response } = require('express');
// Models
const Usuario = require('../models/usuario');
// Bcrypt
const bcrypt = require('bcryptjs');
// JWT
const { generarJWT } = require('../helpers/jwt');

//Crear un nuevo usuario
const crearUsuario = async (req, res = response) => {

    try {

        const { email, password } = req.body;

        //Verificar si el email existe
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //Guardar usuario en BD
        await usuario.save();

        //Generar el JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            msg: 'register',
            usuario,
            token
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });

    }

};

//Login
const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        //Verificar si el email existe
        const usuarioDB = await Usuario.findOne({ email: req.body.email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        };

        //Validar el password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password no válido'
            });
        };

        //Generar el JWT
        const token = await generarJWT(usuarioDB.id, usuarioDB.name);

        res.json({
            ok: true,
            msg: 'login',
            usuario: usuarioDB,
            token
        });
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });

    }


};

//Revalidar token
const revalidarToken = async (req, res = response) => {

    const { uid, name } = req;

    //Generar el JWT
    const token = await generarJWT(uid, name);

    //Obtener el usuario por el uid
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        msg: 'renew',
        token,
        usuario
    });
};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
};