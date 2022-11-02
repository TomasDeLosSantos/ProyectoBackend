const { Router } = require("express");
const { getAll, getProduct, postProduct, putProduct, deleteProduct } = require('../controllers/product');

const productRouter = new Router();

productRouter.get('/', getAll);

productRouter.get('/:id', getProduct);

productRouter.post('/', postProduct);

productRouter.put('/:id', putProduct);

productRouter.delete('/:id', deleteProduct);

module.exports = { productRouter };