const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth/';
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);
        //Conectar a BD
        this.conectarDB();
        //Middlewares
        this.middlewares();
        //Rutas de mi app
        this.routes();
        //Sockets
        this.sockets();
    }
    async conectarDB(){
        await dbConnection();
    }
    middlewares(){
        //Cors
        this.app.use( cors() );
        //Lectura y parseo del body
        this.app.use( express.json() );
        //Directorio público
        this.app.use(express.static('public'));
    }

    routes(){
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
        this.app.use(this.authPath, require('../routes/auth'));
    }
    sockets(){
        this.io.on('connection', (socket ) => socketController(socket, this.io));
    }

    listen(){
        this.server.listen(this.port, ()=>{
            console.log('Escuchando en el puerto ', this.port);
        });

    }
}

module.exports = Server;