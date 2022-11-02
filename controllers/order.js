const MongoOrder = require('../DAOs/MongoOrder');
const mongoOrder = new MongoOrder();

const postOrder = async (req, res) => {
    try {
        let totalOrders = await mongoOrder.getAll(); 
        let order = req.body;
        order.id = parseInt(totalOrders.length + 1);
        res.json(await mongoOrder.save(order));
    } catch (error) {
        console.error(error);
    }
}

module.exports = { postOrder };