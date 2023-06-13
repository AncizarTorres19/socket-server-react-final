const Mensaje = require('../models/mensaje');

const getMensajes = async (req, res) => {

}
const getChatById = async (req, res) => {

    const miId = req.uid;
    const mensajesDe = req.params.de;

    const last30 = await Mensaje.find({
        $or: [
            { de: miId, para: mensajesDe },
            { de: mensajesDe, para: miId },
        ]
    })
        .sort({ createdAt: 'asc' })
        .limit(30);

    res.json({
        ok: true,
        msg: 'getChatById',
        mensajes: last30
    });

}

const createMensaje = async (req, res) => {
}
const updateMensaje = async (req, res) => {
}
const deleteMensaje = async (req, res) => {
}


module.exports = {
    getMensajes,
    getChatById,
    createMensaje,
    updateMensaje,
    deleteMensaje
}
