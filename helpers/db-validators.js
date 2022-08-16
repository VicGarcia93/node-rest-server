const role = require("../models/role");
const usuario = require("../models/usuario");

const esRolValido = async(rol) => {
   
    const existeRol = await role.findOne( {rol});
    
    if(!existeRol){
        throw new Error(`El rol ${ rol } no está registrado en la base de datos` );
    }
   
    
}
//Verificar si el correo existe
const emailExiste = async( correo = '') => {
    const existeEmail = await usuario.findOne( { correo });
    if( existeEmail ){
        throw new Error(`Ese correo ya está registrado`);
    }
}
const existeUsuarioPorId = async( id ) => {
    
    const existeUsuario = await usuario.findById( id );
    if( !existeUsuario ){
        throw new Error(`El Id: ${ id } no existe`);
    }
}

module.exports = {
    esRolValido,
    emailExiste, 
    existeUsuarioPorId
}