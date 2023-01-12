const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
})


function buscarClima(e) {
    e.preventDefault();
    // Validar formulario 
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if (ciudad === '' || pais === '') {
        // Hubo un error 
        mostrarError('Ambos campos son obligatorios');
        return;
    }
    // Consultar la API
    consultarAPI(ciudad, pais);
}

function mostrarError(mensaje) {
    const alerta = document.querySelector('.bg-red-100');
    // Crear una alerta
    if (!alerta) {
        const alerta = document.createElement('div');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-800', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
        alerta.innerHTML = `
    <strong class="font-bold">Error</strong>
    <span class="block">${mensaje}</span>
    `;
        container.appendChild(alerta);

        // Eliminar alerta 
        setTimeout( () =>{
            alerta.remove();
        }, 5000);
    }
}

function consultarAPI(ciudad, pais) {
    const appId = '504ed3b1e5f32c8f919f076f5e35d9b3';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;
    Spinner(); // Carga y muestra el spinner
    fetch(url)
    .then(respuesta => respuesta.json())
    .then(datos =>  {
        console.log(datos);
        limpiarHTML(); // Limpiamos el html previo
        if(datos.cod === '404'){
            mostrarError('Ciudad no encontrada');

            return;
        }

        // Imprimimos la respuesta en el HTML
        mostrarClima(datos);
    } )
}

function mostrarClima(datos) {
    const {name, main: { temp, temp_max, temp_min, humidity } }= datos;
    const gradosCentigrados = kelvinAcentigrados(temp);
    const max = kelvinAcentigrados(temp_max);
    const min = kelvinAcentigrados(temp_min);
    const humedad = humidity;
    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl')
    const actual = document.createElement('p');
    actual.innerHTML = `${gradosCentigrados} &#8451`;
    actual.classList.add('font-bold', 'text-6xl');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Max: ${max} &#8451`
    tempMaxima.classList.add('text-xl');

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Min: ${min} &#8451`
    tempMinima.classList.add('text-xl');

    const humedadCiudad = document.createElement('p');
    humedadCiudad.innerHTML = `Humedad: ${humedad} %`
    humedadCiudad.classList.add('text-xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(humedadCiudad);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);

    resultado.appendChild(resultadoDiv);
}

const kelvinAcentigrados = grados =>  parseInt(grados - 273.15);

function limpiarHTML() {
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function Spinner() {
    limpiarHTML();
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');
    divSpinner.innerHTML = `
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
    `;
    resultado.appendChild(divSpinner);
}
