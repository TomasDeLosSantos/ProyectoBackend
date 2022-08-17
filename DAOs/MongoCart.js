const mongoose = require('mongoose');
const CartModel = {
    id: {type: Number, required: true},
    timestamp: {type: String, required: true},
    products: {type: Array, required: true}
}


class MongoCart {
    constructor(){
        this.connection = mongoose.connect('mongodb+srv://tomas:tomasmongo1234@cluster0.zjndnkl.mongodb.net/?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        this.model = new mongoose.Schema(CartModel);
        this.cart = mongoose.model('carts', this.model);
    }


    async save(obj){
        try {
            const data = await this.cart.find({});
            obj.id = data.length + 1;
            await this.cart.create(obj);
            return obj.id;
        } catch (error) {
            console.log(error);
        }
    }

    async addToCart(obj, id){
        try {
            const cart = this.cart.find({id: id});
            obj.id = cart.products.length + 1;
            return await this.cart.updateOne({id: id}, {$set: {products: cart.products.push(obj)}});
        } catch (error) {
            console.log(error);
        }
    }

    async deleteFromCart(id, id__prod){
        try {
            const cart = this.cart.find({id: id});
            return await this.cart.updateOne({id: id}, {$set: {products: cart.products.filter(o => o.id != id__prod)}});
        } catch (error) {
            console.log(error);
        }
    }

    async getById(id){
        try {
            let carts = await this.cart.find({id: id});
            return carts[0];
        } catch (error) {
            console.log(error);
        }
    }

    async getAll(){
        try {
            return await this.cart.find({});
        } catch (error) {
            console.log(error);
        }
    }

    async deleteById(id){
        try {
            return await this.cart.deleteOne({id: id});
        } catch (error) {
            console.log(error);
        }
    }

    
    async deleteAll(){
        try {
            return await this.cart.collection.drop();
        } catch (error) {
            console.log(error);
        }
    }

    async update(id, obj){
        let { title, price, img } = obj;
        try {
            return await this.cart.updateOne({id: id}, {$set: {title: title, price: price, img: img}});
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = MongoCart;