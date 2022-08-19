const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const usuario = require('../models/usuario');

const validarJWT = async( req = request, res = response, next) => {
    const token = req.header('authToken');

    if( !token ){
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY);

        //leer el usuario que corresponde al uid
        const usuarioAuth = await usuario.findById( uid);

        //validar usuario
        if( !usuarioAuth){
            return res.status(401).json({
                msg: 'Token no válido - usuario no existente en BD'
            });
        }

        //Verificar si el uid tiene estado true
        if( !usuarioAuth.estado ){
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado: false'
            });
        }
        req.usuario = usuarioAuth;
        next();

    } catch (error) {
        return res.status(401).json({
            msg: 'Token no válido'
        });
    }
}

module.exports = { 
    validarJWT
}