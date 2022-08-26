const correo = document.getElementById('txtCorreo');
const password = document.getElementById('txtPassword');
const miFormulario = document.getElementById('miFormulario');

const url = 'http://localhost:3000/api/';

miFormulario.addEventListener('submit', (e)=>{
    e.preventDefault();

    const formData = {};

    for(let el of miFormulario.elements){
        if( el.name.length > 0){
            formData[el.name] = el.value;
        }
    }
    fetch( url + 'auth/login',{
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-type': 'application/json' }
    })
    .then( resp => resp.json())
    .then( ({msg, token}) => {
        if(msg){
            
            console.log( msg );
        }
        console.log(token);
        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch( err => {
        console.log(err);
    })
});




const socket = io();

