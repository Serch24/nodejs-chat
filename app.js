const path = require('path')
const expresss = require('express')
const app = expresss()


/*Empieza el servidor!*/
app.set('port', process.env.PORT || 2015)

app.use(expresss.static(path.join(__dirname, 'inicio')))

const server = app.listen(app.get('port'), () => {
    console.log('funcionando...')

})

const socketIO = require('socket.io')
const io = socketIO(server)

let personas_conectadas = 1
io.on('connection', socket => {
    console.log(`id: ${socket.id}`)

    /* al fin funciona enviar un mensaje privado al id de un usuario ;-) */
    socket.on("mensajePrivado", data => {
        io.to(socket.id).emit('mensajePrivado', data)
    })

    socket.emit('personas', {
        personas: `Personas conectadas: ${personas_conectadas}`
    })
    personas_conectadas++

    /* Mostrar mensaje a todos */
    socket.on(("mensaje"), (data) => {
            console.log(data)
            io.sockets.emit('mensaje', data)

        })
        /* Mostrar que está escribe */
    socket.on('escribiendo', (data) => {
            console.log(data)
            socket.broadcast.emit('escribiendo', data)
        })
        /* Si se desconecta alguien lo mostrará */
    socket.on('disconnect', () => {
        personas_conectadas--
        socket.broadcast.emit('saludo', {
            personas: `Personas conectadas: ${personas_conectadas}`
        })
    })
})