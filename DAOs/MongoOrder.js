const mongoose = require('mongoose');
const OrderModel = {
    id: {type: String, required: true},
    timestamp: {type: String, required: true},
    products: {type: Array, required: true},
    username: {type: String, required: true},
    price: {type: Number, required: true}
}


class MongoCart {
    constructor(){
        this.connection = mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        this.model = new mongoose.Schema(OrderModel);
        this.order = mongoose.model('orders', this.model);
    }


    async save(obj){
        try {
            await this.order.create(obj);
            return obj.id;
        } catch (error) {
            console.log(error);
        }
    }

    async getAll(){
        try {
            return await this.order.find({});
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = MongoCart;