const admin = require('firebase-admin');

const serviceAccount = require('../backend-7f380-firebase-adminsdk-wmuhe-12ccbb75cd.json');

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     name: 'cart'
// })


class FirebaseCart {
    constructor(){
        this.db = admin.firestore();
        this.query = this.db.collection('carts');
    }

    async save(obj){
        try {
            const response = await this.query.get();
            obj.id = response.docs.length + 1;
            const newDoc = this.query.doc(`${obj.id}`);
            await newDoc.create(obj);
            return obj.id;
        } catch (error) {
            console.log(error);
        }
    }

    async addToCart(obj, id){
        try {
            const cart = this.query.doc(`${id}`);
            const response = await cart.get();
            obj.id = response.data().products.length + 1;
            return await cart.update({products: response.data().products.push(obj)});
        } catch (error) {
            console.log(error);
        }
    }

    async deleteFromCart(id, id__prod){
        try {
            const cart = this.query.doc(`${id}`);
            const response = await cart.get();
            return await cart.update({products: response.data().products.filter(p => p.id != id__prod)});
        } catch (error) {
            console.log(error);
        }
    }

    async getById(id){
        try {
            const doc = this.query.doc(`${id}`);
            const response = await doc.get();
            return response.data();
        } catch (error) {
            console.log(error);
        }
    }

    async getAll(){
        try {
            const response = await this.query.get();
            return response.docs.map(p => p.data());
        } catch (error) {
            console.log(error);
        }
    }

    async deleteById(id){
        try {
            const doc = this.query.doc(`${id}`);
            const response = await doc.delete();
            return true;
        } catch (error) {
            console.log(error);
        }
    }

    async update(id, obj){
        let { title, price, img } = obj;
        try {
            const doc = this.query.doc(`${id}`);
            const response = await doc.update({title: title, price: price, img: img});
            return true;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = FirebaseCart;