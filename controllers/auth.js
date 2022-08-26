const { response } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");

const login = async(req, res = response ) => {
    
    const {correo, password} = req.body;
    try {
        //Verificat si el email existe
        const usuario = await Usuario.findOne({correo});
        if( !usuario ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - Correo'
            })
        }

        //Si el usuario está activo
        if( !usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos- estado: false'
            });
        }
        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );

        if( !validPassword ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos- password'
            });
        }
        //Generar JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Algo salió mal'})
    } 
}

const renovarToken = async( req, res = response)=>{
    const { usuario } = req;
    //Generar JWT
    const token = await generarJWT( usuario.id );
    res.json({
        usuario,
        token
    });
}

module.exports = {
    login,
    renovarToken
}