const mongoose = require('mongoose');
const CartModel = {
    id: {type: String, required: true},
    timestamp: {type: String, required: true},
    products: {type: Array, required: true}
}


class MongoCart {
    constructor(){
        this.connection = mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        this.model = new mongoose.Schema(CartModel);
        this.cart = mongoose.model('carts', this.model);
    }


    async save(obj){
        try {
            const data = await this.cart.find({});
            await this.cart.create(obj);
            return obj.id;
        } catch (error) {
            console.log(error);
        }
    }

    async addToCart(obj, id){
        try {
            const userCart = await this.cart.find({id: id});
            // console.log(cart[0]);
            const userProd = userCart[0].products;

            if(userProd.find(b => b.title == obj.title) !== undefined){
                let index = userProd.findIndex(b => b.title == obj.title);
                userProd[index].quant += obj.quant;
                await this.cart.updateOne({id: id}, {$set: {products: userProd}});
            } else{
                obj.id = userProd.length + 1;
                obj.quant = 1;
                await this.cart.updateOne({id: id}, {$set: {products: [...userProd, obj]}});
            }

            return obj.title;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteFromCart(id, id__prod){
        try {
            const userCart = await this.cart.find({id: id});
            const delItem = userCart[0].products.find(i => i.id == id__prod);
            await this.cart.updateOne({id: id}, {$set: {products: userCart[0].products.filter(o => o.id != id__prod)}});
            return delItem.title;
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

    async deleteAllProducts(id){
        try {
            return await this.cart.updateOne({id: id}, {$set: {products: []}});
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