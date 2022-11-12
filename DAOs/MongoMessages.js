const mongoose = require('mongoose');
const MessageModel = {
    email: {type: String, required: true},
    type: {type: String, required: true},
    timestamp: {type: String, required: true},
    body: {type: String, required: true}
}


class MongoMessages {
    constructor(){
        this.connection = mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        this.model = new mongoose.Schema(MessageModel);
        this.message = mongoose.model('messages', this.model);
    }

    async save(obj){
        try {
            const data = await this.message.find({});
            await this.message.create(obj);
            return obj.id;
        } catch (error) {
            console.log(error);
        }
    }

    async getByEmail(email){
        try {
            let messages = await this.message.find({email: email});
            return messages;
        } catch (error) {
            console.log(error);
        }
    }

    async getAll(){
        try {
            return await this.message.find({});
        } catch (error) {
            console.log(error);
        }
    }

    async deleteById(id){
        try {
            return await this.message.deleteOne({id: id});
        } catch (error) {
            console.log(error);
        }
    }

    async deleteAll(){
        try {
            return await this.message.collection.drop();
        } catch (error) {
            console.log(error);
        }
    }

    async deleteAllProducts(id){
        try {
            return await this.message.updateOne({id: id}, {$set: {products: []}});
        } catch (error) {
            console.log(error);
        }
    }

    async update(id, obj){
        let { title, price, img } = obj;
        try {
            return await this.message.updateOne({id: id}, {$set: {title: title, price: price, img: img}});
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = MongoMessages;