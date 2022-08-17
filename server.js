const express = require('express');
const fileSystem = require('./fileSystem');
const MongoProduct = require('./DAOs/MongoProduct');
const MongoCart = require('./DAOs/MongoCart');
const FirebaseProduct = require('./DAOs/FirebaseProduct');
const FirebaseCart = require('./DAOs/FirebaseCart');

if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}

const { Router } = express;
const app = express();
const productRouter = Router();
const cartRouter = Router();
const PORT = process.env.PORT || 8080;



let data;
let cart;

switch(process.env.PERSISTANCE){
    case 'local':
        data = new fileSystem('./products.txt');
        cart = new fileSystem('./cart.txt');
        break;
    case 'mongo':
        data = new MongoProduct();
        cart = new MongoCart();
        break;
    case 'firebase':
        data = new FirebaseProduct();
        cart = new FirebaseCart();
        break;
    default: 
        data = new fileSystem('./products.txt');
        cart = new fileSystem('./cart.txt');
        break;
}



let admin = true;

const adminCheck = (req, res, next) => {
    if(admin == true){
        next();
    } else{
        res.send({ error: -1, description: `Route not authorized`})
    }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/public'));

app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);


productRouter.get('/', async (req,res) => {
    let products = await data.getAll();
    res.json(products); 
})

productRouter.post('/', adminCheck, async (req,res) => {
    try {
        data.save(req.body);
        res.json(req.body.title);
    } catch (error) {
        console.error(error);
        res.json(false);
    }
})

productRouter.put('/:id', adminCheck, async (req, res) => {
    let id = req.params.id;
    let body = req.body;
    try {
        let response = await data.update(id, body);
        res.json(response.title);
    } catch (error) {
        console.error(error);
    }
})

productRouter.delete('/:id', adminCheck, async (req, res) => {
    // let products = await data.getAll();
    let book = await data.getById(req.params.id);
    if(book){
        await data.deleteById(req.params.id);
        res.json(book.title);
    } else{
        res.send({ error: "Not Found" });
    }
})

cartRouter.post('/', async (req, res) => {
    try {
        // let data = await cart.getAll();
        let newCart = {
            timestamp: new Date().toLocaleString(), 
            products: [] 
        }
        
        res.send(await cart.save(newCart));

    } catch (error) {
        console.error(error);
    }
})

cartRouter.delete('/:id', async (req, res) => {
    try {
        res.send(await cart.deleteById(req.params.id));
    } catch (error) {
        console.error(error);
    }
})

cartRouter.get('/:id/products', async (req, res) => {
    try {
        let data = await cart.getById(req.params.id);
        res.send(data.products);
    } catch (error) {
        console.error(error);
    }
})

cartRouter.post('/:id/products', async (req, res) => {
    try {
        res.json(await cart.addToCart(req.body, req.params.id));
    } catch (error) {
        console.error(error);
    }
})

cartRouter.delete('/:id/products/:id__prod', async (req, res) => {
    try {
        res.json(await cart.deleteFromCart(req.params.id, req.params.id__prod));
    } catch (error) {
        console.error(error);
    }
})


app.listen(PORT, () => {
    console.log(`Server Running at ${PORT}`);
})