const { response, request } = require('express');

const usuariosGet = (req = request, res = response)=>{

    const {nombre} = req.query;

    res.json({ mensaje: 'get api - controlador',
        nombre

});
}

const usuariosPost = (req, res = response)=>{
    const {nombre, edad} = req.body;
    res.json({ 
        mensaje: 'post api - controlador',
        nombre,
        edad
    });
}
const usuariosPut = (req, res = response)=>{
    const id = req.params.id;
    res.json({ 
        mensaje: 'put api - controlador',
        id

    });
}
const usuariosPatch = (req, res = response)=>{
    res.json({ mensaje: 'patch api - controlador' });
}
const usuariosDelete = (req, res = response)=>{
    res.json({ mensaje: 'delete api - controlador' });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}