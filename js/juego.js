// VARIABLES
const nombreJugador = localStorage.getItem("nombreJugador");
const elementoNombre = document.getElementById("nombre-jugador");
const contenedorPreguntas = document.getElementById("contenedor-preguntas");
const botonComprobar = document.getElementById("boton-comprobar");
const tituloRonda = document.getElementById("titulo-ronda");
const resultado = document.getElementById("resultado");

let preguntasPartida = [];
let rondaActual = 1;
let aciertosTotales = 0;
let erroresTotales = 0;

elementoNombre.textContent = nombreJugador;


// MEZCLAR
function mezclarArray(array) {

    const arrayMezclado = [...array];

    for (let i = arrayMezclado.length - 1; i > 0; i--) {

        const posicionAleatoria = Math.floor(Math.random() * (i + 1));

        [arrayMezclado[i], arrayMezclado[posicionAleatoria]] =
            [arrayMezclado[posicionAleatoria], arrayMezclado[i]];
    }

    return arrayMezclado;
}


// MOSTRAR PREGUNTAS
function mostrarPreguntas(preguntas) {

    preguntas.forEach(function (pregunta) {

        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta-pregunta");

        const categoria = document.createElement("span");
        categoria.textContent = pregunta.categoria;
        categoria.classList.add("categoria-pregunta");

        const titulo = document.createElement("h3");
        titulo.textContent = pregunta.pregunta;

        const contenedorOpciones = document.createElement("div");
        contenedorOpciones.classList.add("opciones-respuesta");

        const opcionesMezcladas = mezclarArray(pregunta.opciones);

        opcionesMezcladas.forEach(function (opcion) {

            const etiqueta = document.createElement("label");
            etiqueta.classList.add("opcion-respuesta");

            const input = document.createElement("input");

            input.type = "radio";
            input.name = "pregunta-" + pregunta.id;
            input.value = opcion;

            const textoOpcion = document.createTextNode(opcion);

            etiqueta.appendChild(input);
            etiqueta.appendChild(textoOpcion);

            contenedorOpciones.appendChild(etiqueta);
        });

        tarjeta.appendChild(categoria);
        tarjeta.appendChild(titulo);
        tarjeta.appendChild(contenedorOpciones);

        contenedorPreguntas.appendChild(tarjeta);
    });
}


// BLOQUEAR PREGUNTAS
function bloquearPreguntas(preguntas) {

    preguntas.forEach(function (pregunta) {

        const opciones = document.querySelectorAll(
            'input[name="pregunta-' + pregunta.id + '"]'
        );

        opciones.forEach(function (opcion) {
            opcion.disabled = true;
        });
    });
}


// MOSTRAR RESULTADO FINAL
function mostrarResultado(ganado) {

    resultado.hidden = false;

    const resultadoPartida = {
        jugador: nombreJugador,
        aciertos: aciertosTotales,
        errores: erroresTotales,
        ganado: ganado
    };

    console.log(resultadoPartida);
    console.log(JSON.stringify(resultadoPartida));

    if (ganado) {

        resultado.innerHTML =
            "<h2>¡Has ganado!</h2>" +
            "<p>Jugador: " + nombreJugador + "</p>" +
            "<p>Aciertos: " + aciertosTotales + "</p>" +
            "<p>Errores: " + erroresTotales + "</p>";

    } else {

        resultado.innerHTML =
            "<h2>Has perdido</h2>" +
            "<p>Jugador: " + nombreJugador + "</p>" +
            "<p>Aciertos: " + aciertosTotales + "</p>" +
            "<p>Errores: " + erroresTotales + "</p>";
    }

    botonComprobar.disabled = true;
}

// CARGAR JSON
async function cargarPreguntas() {

    try {

        const respuesta = await fetch("data/preguntas.json");

        if (!respuesta.ok) {
            throw new Error("No se han podido cargar las preguntas");
        }

        const preguntas = await respuesta.json();

        const preguntasMezcladas = mezclarArray(preguntas);

        preguntasPartida = preguntasMezcladas.slice(0, 4);

        const preguntasRonda1 = preguntasPartida.slice(0, 2);

        mostrarPreguntas(preguntasRonda1);

    } catch (error) {

        console.error(error);
        alert("Ha ocurrido un error al cargar las preguntas.");
    }
}


// COMPROBAR RESPUESTAS
botonComprobar.addEventListener("click", function () {

    let preguntasRonda;

    if (rondaActual === 1) {
        preguntasRonda = preguntasPartida.slice(0, 2);
    } else {
        preguntasRonda = preguntasPartida.slice(2, 4);
    }


    // comprobar que estén todas respondidas
    for (let pregunta of preguntasRonda) {

        const respuesta = document.querySelector(
            'input[name="pregunta-' + pregunta.id + '"]:checked'
        );

        if (respuesta === null) {
            alert("Tienes que responder todas las preguntas.");
            return;
        }
    }


    let aciertosRonda = 0;
    let erroresRonda = 0;


    // comprobar respuestas
    preguntasRonda.forEach(function (pregunta) {

        const respuesta = document.querySelector(
            'input[name="pregunta-' + pregunta.id + '"]:checked'
        );

        if (respuesta.value === pregunta.correcta) {
            aciertosRonda++;
        } else {
            erroresRonda++;
        }
    });


    aciertosTotales += aciertosRonda;
    erroresTotales += erroresRonda;

    bloquearPreguntas(preguntasRonda);


    // si falla alguna, pierde
    if (erroresRonda > 0) {

        alert("Has fallado alguna pregunta. Fin del concurso.");

        mostrarResultado(false);

        return;
    }


    // pasar a ronda 2
    if (rondaActual === 1) {

        alert("¡Has superado la ronda 1!");

        rondaActual = 2;

        tituloRonda.textContent = "Ronda 2";

        const preguntasRonda2 = preguntasPartida.slice(2, 4);

        mostrarPreguntas(preguntasRonda2);

    } else {

        // si llega aquí ha acertado la ronda 2
        alert("¡Has ganado el concurso!");

        mostrarResultado(true);
    }

});


// INICIAR
cargarPreguntas();