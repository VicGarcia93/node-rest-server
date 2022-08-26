const { comprobarJWT } = require("../helpers/generar-jwt");

const ChatMensajes = require('../models/chat-mensajes');
const chatMensajes = new ChatMensajes();
const socketController = async (socket, io) =>{
   const usuario = await comprobarJWT(socket.handshake.headers['authtoken']);
    
   if(!usuario){
    return socket.disconnect();
   }
   //Agregar el usuario conectado
   chatMensajes.agregarUsuario( usuario);
   io.emit('usuarios-activos', chatMensajes.usuariosArr);
   socket.emit('recibir-mensajes', chatMensajes.ultimos10);

   //conectarlo a una sala especial
   socket.join( usuario.id ); //global, socket.id, usuario.id 

   //Limpiar cuando alguien se desconecta
   socket.on('disconnect', ()=>{
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
        
   });

   socket.on('enviar-mensaje', ( { uid, mensaje} ) => {

    if(uid){
        //Mensaje privado
        socket.to( uid ).emit('mensaje-privado', { de: usuario.nombre, mensaje} );
    }else{
        
        chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
        io.emit('recibir-mensajes', chatMensajes.ultimos10);
    }
   });

}


module.exports = {
    socketController
}