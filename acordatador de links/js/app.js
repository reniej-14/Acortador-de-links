const formulario = document.querySelector('#formulario');
const link = document.querySelector('#link');
const submit = document.querySelector('#submit');
const resultado = document.querySelector('#resultado');

let objLinks = [];

document.addEventListener('DOMContentLoaded', () => {
    //Cargar localStorage e imprimir HTML
    cargarLocalStorage();
    imprimirLinks();

    //Validar formulario
    formulario.addEventListener('submit', validarFormulario);
})

function validarFormulario(e) {
    e.preventDefault();

    if (link.value === '') {
        alerta('Please add a link');
        return;
    }

    //Conectar con la API y generar link corto
    shortenUrl(link.value);
}

function alerta(mensaje) {
    const existeAlerta = document.querySelector('.alerta');

    if (!existeAlerta) {
        const alerta = document.createElement('p');
        alerta.classList.add('alerta');
        alerta.textContent = mensaje;

        link.classList.add('red');

        formulario.insertBefore(alerta, submit);
    } 
}

async function shortenUrl(longUrl) {
    const accessToken = '2b8f9fab4d59fbfbfd71778d333f16ee0793bb1d'; // Reemplaza con tu Access Token

    try {
        const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ "long_url": longUrl })
        });

        if (response.ok) {
            const data = await response.json();
            const linkCorto = {
                corto: data.link,
                original: link.value
            }
            objLinks = [...objLinks, linkCorto];
            
            console.log(objLinks);

            //Guardar links en localStorage
            guardarLinkLocalStorage(objLinks);

            //Imprimir links HTML
            limpiarHTML();
            imprimirLinks();

            //Resetear formulario
            formulario.reset();
        } else {
            console.error('Error al acortar la URL:', response.status);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}

function guardarLinkLocalStorage(link) {
    localStorage.setItem('Links', JSON.stringify(objLinks));
}

function cargarLocalStorage() { 
    objLinks = JSON.parse(localStorage.getItem('Links')) || [];
}

function imprimirLinks() {
    objLinks.forEach(enlace => {
        const contenedor = document.createElement('div');
        contenedor.classList.add('resultado__flex');

        const divPrimerLink = document.createElement('div');
        divPrimerLink.classList.add('resultado__link-original');
        divPrimerLink.innerHTML = `
            <p class="color-original padding">${enlace.original}</p>
        `;

        const divSegundoLink = document.createElement('div');
        divSegundoLink.classList.add('resultado__link-final');

        const linkCorto = document.createElement('p');
        linkCorto.classList.add('color-final');
        linkCorto.textContent = enlace.corto;

        const btnCopiar = document.createElement('a');
        btnCopiar.classList.add('resultado__button');
        btnCopiar.textContent = 'Copy';
        btnCopiar.onclick = () => {
            btnCopiar.textContent = 'Copied!';
            btnCopiar.classList.add('colorSecundario');

            navigator.clipboard.writeText(btnCopiar.previousElementSibling.textContent)
                .then(() => {
                    console.log('Texto copiado')
                })
        }

        //Insertar HTML
        divSegundoLink.appendChild(linkCorto);
        divSegundoLink.appendChild(btnCopiar);


        contenedor.appendChild(divPrimerLink);
        contenedor.appendChild(divSegundoLink);

        resultado.appendChild(contenedor)
    });
} 

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}