const url = 'http://localhost:3000/api/auth/';

const txtUid = document.getElementById('txtUid');
const txtMensaje = document.getElementById('txtMensaje');
const ulUsuarios = document.getElementById('ulUsuarios');
const ulMensajes = document.getElementById('ulMensajes');
const btnSalir = document.getElementById('btnSalir');


let usuario = null;
let socket = null;

const validarJWT = async()=>{
    const token = localStorage.getItem('token') || '';

    if(token.length <= 10 ){
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const respuesta = await fetch( url, {
        headers: { 'authToken' : token }
    });

    const { usuario: userDB, token: tokenDB } = await respuesta.json();

    localStorage.setItem('token', tokenDB);

    usuario = userDB;
    await conectarSocket();
}
const conectarSocket = async()=>{
    socket = io({ 
        'extraHeaders': {
            'authToken': localStorage.getItem('token')
        }
    });

    socket.on('connect', ()=>{

    });

    socket.on('disconnect', ()=>{

    });

    socket.on('recibir-mensajes', ( payload )=>{
        let msjHTML = '';
        payload.forEach(({nombre, mensaje}) => {
            msjHTML += `
                <li>
                    <p>
                        <span class="text-primary"> ${ nombre }: </span>
                        <span class="text-muted"> ${ mensaje } </span>
                    </p>    
                </li>
                
                `

                ulMensajes.innerHTML = msjHTML;
        });
    });

    socket.on('usuarios-activos', ( payload )=>{
        console.log(payload);
        let userHTML = '';
        payload.forEach(({nombre, uid}) => {
            userHTML += `
                <li>
                    <p>
                        <h5 class="text-success"> ${ nombre } </h5>
                        <span class="fs-6 text-muted"> ${ uid } </span>
                    </p>    
                </li>
                
                `

                ulUsuarios.innerHTML = userHTML;
        });
    });

    socket.on('mensaje-privado', ( { de, mensaje} )=>{
        console.log(de, mensaje);
    });
}

txtMensaje.addEventListener('keyup', ({ code })=>{
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;
    console.log(code);
    if( code !== 'Enter' ) {return; }
    if( mensaje.length === 0) {return;}

    socket.emit('enviar-mensaje', { mensaje, uid });

    txtMensaje.value = "";
});

const main = async()=>{
    await validarJWT();
}

main();