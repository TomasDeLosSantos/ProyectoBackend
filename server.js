const express = require('express');
const app = express();
if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const MongoMessages = require('./DAOs/MongoMessages');
const mongoMessages = new MongoMessages();
const cors = require('cors');
const { Server: HttpServer} = require('http');
const { Server: Socket} = require('socket.io');
const httpServer = new HttpServer(app);
const io = new Socket(httpServer);
const { authRouter } = require('./routers/auth');
const { productRouter } = require('./routers/product');
const { cartRouter } = require('./routers/cart');
const { orderRouter } = require('./routers/order');
const { mailRouter } = require('./routers/mail');
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 30000
    }
}))

app.use('/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/mail', mailRouter);

io.on('connection', async socket => {
    console.log("New client conected");
    socket.emit('messages', await mongoMessages.getAll());

    socket.on('message', async msg => {
        await mongoMessages.save(msg);
        io.sockets.emit('messages', await mongoMessages.getAll());
    })

    socket.on('getMessages', async () => {
        io.sockets.emit('messages', await mongoMessages.getAll());
    })

    socket.on('disconnect', () => console.log("User disconected") )
})

app.use('/api/chat', async (req, res) => {
    res.json(await mongoMessages.getAll());
})

httpServer.listen(PORT, () => {
    console.log(`Server Running at ${PORT}`);
})