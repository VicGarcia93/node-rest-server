const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { validationResult } = require('express-validator');

const usuariosGet = async (req = request, res = response)=>{

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
   
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query )
        .skip( Number(desde ) )
        .limit( Number(limite ) )
    ]);
    res.json({total, usuarios});
}

const usuariosPost = async(req, res = response)=>{
   
    const { nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol});

    
    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(usuario.password, salt)
    //Guarda la contraseña
    await usuario.save();
    res.json({ 
        mensaje: 'post api - controlador',
        usuario
    });
}
const usuariosPut = async(req, res = response)=>{
    const { id } = req.params;
    const { _id, password, google, correo, rol ,...resto} = req.body;

    if( password ){
        //Encriptar la contraseña
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt)
    }
    if( rol ){
        resto.rol = rol;
    }
    const usuario = await Usuario.findByIdAndUpdate( id, resto);

    res.json({ 
        mensaje: 'put api - controlador',
        usuario
    });
}
const usuariosPatch = async(req, res = response)=>{
    res.json({ mensaje: 'patch api - controlador' });
}
const usuariosDelete = async(req, res = response)=>{
    const { id } = req.params;

    //Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );
    res.json(usuario);
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}