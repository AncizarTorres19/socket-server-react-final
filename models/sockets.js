//Helpers
const { comprobarJWT } = require("../helpers/jwt");
//Controllers
const { usuarioConectado, usuarioDesconectado, getUsuarios, grabarMensaje } = require("../controllers/sockets");


class Sockets {

    constructor(io) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', async (socket) => {

            console.log('Cliente conectado');

            const [valido, uid] = comprobarJWT(socket.handshake.query['x-token']);

            //Verificar autenticacion
            if (!valido) {
                return socket.disconnect();
            }

            await usuarioConectado(uid);

            // Union a una sala de socket.io
            socket.join(uid);

            // this.io.to('sala-gamer').emit('mensaje-bienvenida', 'Bienvenido al servidor'); //TODO: Emitir todos los usuarios conectados a la sala gamer

            //TODO: Saber que usuario esta activo mediante el UID

            //TODO: Emitir todos los usuarios conectados
            this.io.emit('lista-usuarios', await getUsuarios());

            //TODO: Socket join, uid

            //TODO: Escuchar cuando el cliente manda un mensaje
            //mensaje-personal
            socket.on('mensaje-personal', async (payload) => {
                const mensaje = await grabarMensaje(payload);
                this.io.to(payload.para).emit('mensaje-personal', mensaje);
                this.io.to(payload.de).emit('mensaje-personal', mensaje);
            });

            //TODO: Disconnect
            //Marcar en la base de datos que el usuario se desconecto

            //TODO: Emitir todos los usuarios conectados

            socket.on('disconnect', async () => {
                await usuarioDesconectado(uid);
                this.io.emit('lista-usuarios', await getUsuarios());
            });

        });
    }


}


module.exports = Sockets;