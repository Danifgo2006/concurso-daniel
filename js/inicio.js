const formulario = document.getElementById("formulario-inicio");
const campoNombre = document.getElementById("nombre");

formulario.addEventListener("submit", function(evento) {

    evento.preventDefault();

    const nombreJugador = campoNombre.value.trim();

    if (nombreJugador === "") {
        alert("Por favor, introduce tu nombre.");
        return;
    }

    localStorage.setItem("nombreJugador", nombreJugador);

    window.location.href = "juego.html";
});