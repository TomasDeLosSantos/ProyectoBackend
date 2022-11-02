const mongoose = require('mongoose');
const ProductModel = {
    id: {type: Number, required: true},
    title: {type: String, required: true},
    price: {type: Number, required: true},
    img: {type: String, required: true},
}


class MongoProduct {
    constructor(){
        this.connection = mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        this.model = new mongoose.Schema(ProductModel);
        this.product = mongoose.model('books', this.model);
    }


    async save(obj){
        try {
            const data = await this.product.find({});
            obj.id = data.length + 1;
            await this.product.create(obj);
            return obj.id;
        } catch (error) {
            console.log(error);
        }
    }

    async getById(id){
        try {
            return await this.product.find({id: id});
        } catch (error) {
            console.log(error);
        }
    }

    async getAll(){
        try {
            return await this.product.find({});
        } catch (error) {
            console.log(error);
        }
    }

    async deleteById(id){
        try {
            return await this.product.deleteOne({id: id});
        } catch (error) {
            console.log(error);
        }
    }

    
    async deleteAll(){
        try {
            return await this.product.collection.drop();
        } catch (error) {
            console.log(error);
        }
    }

    async update(id, obj){
        let { title, price, img } = obj;
        try {
            await this.product.updateOne({id: id}, {$set: {title: title, price: price, img: img}});
            return obj;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = MongoProduct;