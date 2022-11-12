const MongoCart = require('../DAOs/MongoCart');
const cart = new MongoCart();

const cartPost = async (req, res) => {
    try {
        let newCart = {
            timestamp: new Date().toLocaleString(),
            products: []
        }

        res.send(await cart.save(newCart));

    } catch (error) {
        console.error(error);
    }
}

const cartDelete = async (req, res) => {
    try {
        res.send(await cart.deleteById(req.params.id));
    } catch (error) {
        console.error(error);
    }
}

const cartGetProducts = async (req, res) => {
    try {
        let data = await cart.getById(req.params.id);
        res.send(data.products);
    } catch (error) {
        console.error(error);
    }
}

const cartPostProducts = async (req, res) => {
    try {
        res.json(await cart.addToCart(req.body, req.params.id));
    } catch (error) {
        console.error(error);
    }
}

const cartDeleteProducts = async (req, res) => {
    try {
        res.json(await cart.deleteFromCart(req.params.id, req.params.id__prod));
    } catch (error) {
        console.error(error);
    }
}

const cartDeleteAllProducts = async (req, res) => {
    try {
        res.json(await cart.deleteAllProducts(req.params.id));
    } catch (error) {
        console.error(error);
    }
}

module.exports = { cart, cartPost, cartDelete, cartGetProducts, cartPostProducts, cartDeleteProducts, cartDeleteAllProducts }