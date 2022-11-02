const MongoProduct = require('../DAOs/MongoProduct');
const data = new MongoProduct();

const getAll = async (req, res) => {
    let products = await data.getAll();
    res.json(products);
}

const getProduct = async (req, res) => {
    let product = await data.getById(req.params.id);
    if(product[0] == undefined){
        res.json({error: 1});
    } else{
        res.json(product[0]);
    }
}

const postProduct = async (req, res) => {
    try {
        data.save(req.body);
        res.json(req.body.title);
    } catch (error) {
        console.error(error);
        res.json(false);
    }
}

const putProduct = async (req, res) => {
    let id = req.params.id;
    let body = req.body;
    try {
        let response = await data.update(id, body);
        res.json(response.title);
    } catch (error) {
        console.error(error);
    }
}

const deleteProduct = async (req, res) => {
    let book = await data.getById(req.params.id);
    if (book[0]) {
        await data.deleteById(req.params.id);
        res.json(book[0].title);
    } else {
        res.send({ error: "Not Found" });
    }
}

module.exports = { getAll, getProduct, postProduct, putProduct, deleteProduct }