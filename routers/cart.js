const { Router } = require('express');
const { cartPost, cartDelete, cartGetProducts, cartPostProducts, cartDeleteProducts, cartDeleteAllProducts } = require('../controllers/cart');

const cartRouter = new Router();

cartRouter.post('/', cartPost);

cartRouter.delete('/:id', cartDelete);

cartRouter.get('/:id/products', cartGetProducts);

cartRouter.post('/:id/products', cartPostProducts);

cartRouter.delete('/:id/products/:id__prod', cartDeleteProducts);

cartRouter.delete('/:id/products', cartDeleteAllProducts);

module.exports = { cartRouter };