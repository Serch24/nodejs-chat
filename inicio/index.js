const socket = io()
const enviar = document.querySelector("i")
const texto = document.querySelector("#mensaje")
const nombre = document.querySelector("#nombre")
const chats = document.querySelector("section")
const escribiendo = document.querySelector(".escribiendo")
const texto_propio = document.querySelector(".mensajes-propios")
    //const repe = document.querySelector(".repe")
    //const personas_online = document.querySelector(".online")
let letras = [];
let contador = 0
enviar.addEventListener("click", () => {
    if (!texto.value == '') {
        socket.emit('mensaje', {
            nombre: nombre.value,
            texto: texto.value
        })
        socket.emit('mensajePrivado', {
            nombre: nombre.value,
            texto: texto.value
        })
    }
})

socket.on('mensajePrivado', (data) => {
    chats.innerHTML += `<div class='mensajes-propios'><p>${data.texto}</p></div>`
})

socket.on('mensaje', (data) => {
    chats.innerHTML += `<div class='mensajes'><p> ${data.texto}</p></div>`
    texto.value = ""
})

socket.on('personas', (data) => {
    escribiendo.innerHTML = `${data.personas}`
})

texto.addEventListener("keydown", (e) => {
    if (e.keyCode == 13) {
        socket.emit('mensaje', {
            nombre: nombre.value,
            texto: texto.value
        })
        socket.emit('mensajePrivado', {
            nombre: nombre.value,
            texto: texto.value
        })
    }
    socket.emit("escribiendo", {
        nombre: nombre.value,
        escribir: true
    })
})

/* Cuando deje de escribir envia un objeto */
texto.addEventListener("keyup", () => {
    socket.emit("escribiendo", {
        nombre: nombre.value,
        escribir: false
    })

})

socket.on('escribiendo', (data) => {
    if (data.escribir) {
        escribiendo.innerHTML = `${data.nombre} está escribiendo...`
    } else {
        setTimeout(() => {
            escribiendo.innerHTML = ""
        }, 3000)
    }
})