const express = require('express');
const fileSystem = require('./fileSystem');
const { Router } = express;
const app = express();
// const router = Router();
const productRouter = Router();
const cartRouter = Router();
const PORT = process.env.PORT || 8080;

const data = new fileSystem('./products.txt');
const cart = new fileSystem('./cart.txt');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/public'));

// if(process.env.NODE_ENV === 'production'){
//     app.use(express.static('../client/build'))
// } else{
// }

// app.use('/api', router);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);


productRouter.get('/', async (req,res) => {
    let products = await data.getAll();
    res.json(products); 
})

productRouter.post('/', async (req,res) => {
    try {
        data.save(req.body);
        res.json(req.body.title);
    } catch (error) {
        console.error(error);
        res.json(false);
    }
})

productRouter.put('/:id', async (req, res) => {
    let id = req.params.id;
    let body = req.body;
    try {
        let response = await data.update(id, body);
        res.json(response.title);
    } catch (error) {
        console.error(error);
    }
})

productRouter.delete('/:id', async (req, res) => {
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