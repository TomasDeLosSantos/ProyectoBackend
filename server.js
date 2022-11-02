const express = require('express');
const app = express();
if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { authRouter } = require('./routers/auth');
const { productRouter } = require('./routers/product');
const { cartRouter } = require('./routers/cart');
const { orderRouter } = require('./routers/order');
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/public'));
app.use(session({
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    secret: "shhhhhhhhhhhhhhhhhhhhh",
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

app.listen(PORT, () => {
    console.log(`Server Running at ${PORT}`);
})