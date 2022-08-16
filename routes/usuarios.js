const { Router } = require('express');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { esRolValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const router = Router();

router.get('/', usuariosGet );

router.post('/', [
    check('correo', 'El correo no es válido').isEmail().custom( emailExiste ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio y minímo de 6 carácteres').isLength({ min: 6 }),
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom( esRolValido ),
    validarCampos
],usuariosPost);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRolValido ),
    validarCampos
],usuariosPut);

router.patch('/', usuariosPatch);
router.delete('/:id', [
    check( 'id', 'No es un Id válido').isMongoId(),
    check( 'id' ).custom( existeUsuarioPorId ),
    validarCampos
],usuariosDelete);

module.exports = router;