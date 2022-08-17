const fs = require('fs');

class FileSystem{
    constructor(url){
        this.url = url;
    }

    async save(obj){
        try {
            const data = JSON.parse(await fs.promises.readFile(this.url, 'utf-8'));
            obj.id = data.length + 1;
            data.push(obj);
            await fs.promises.writeFile(this.url, JSON.stringify(data, null, 2));
            // console.log(obj.id);
            return obj.id;
        } catch (error) {
            console.log(error);
        }
    }

    async addToCart(obj, id){
        try {
            const data = JSON.parse(await fs.promises.readFile(this.url, 'utf-8'));
            obj.id = data.find(c => c.id == id).products.length + 1;
            data.find(c => c.id == id).products.push(obj);
            await fs.promises.writeFile(this.url, JSON.stringify(data, null, 2));
            return obj.title;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteFromCart(id, id__prod){
        try {
            const data = JSON.parse(await fs.promises.readFile(this.url, 'utf-8'));
            let product = data.find(c => c.id == id).products.find(b => b.id == id__prod);
            data.find(c => c.id == id).products = data.find(c => c.id == id).products.filter(p => p.id != id__prod);

            await fs.promises.writeFile(this.url, JSON.stringify(data, null, 2));
            // console.log(obj.id);
            return product.title;
        } catch (error) {
            console.log(error);
        }
    }

    async getById(id){
        try {
            const data = JSON.parse(await fs.promises.readFile(this.url, 'utf-8'));
            return data.find(p => p.id == id);
        } catch (error) {
            console.log(error);
        }
    }

    async getAll(){
        try {
            const data = JSON.parse(await fs.promises.readFile(this.url, 'utf-8'));
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteById(id){
        try {
            let data = JSON.parse(await fs.promises.readFile(this.url, 'utf-8'));
            data = data.filter(p => p.id != id);
            await fs.promises.writeFile(this.url, JSON.stringify(data, null, 2));
            return id;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteAll(){
        try {
            await fs.promises.writeFile(this.url, JSON.stringify([], null, 2));
            console.log(JSON.parse(await fs.promises.readFile(this.url, 'utf-8')));
        } catch (error) {
            console.log(error);
        }
    }

    async update(id, obj){
        let { title, price, img } = obj;
        try {
            const data = JSON.parse(await fs.promises.readFile(this.url, 'utf-8'));
            let found = data.findIndex(p => p.id == id);
            if(found != -1){
                data[found].title = title;
                data[found].price = price;
                data[found].img = img;
                await fs.promises.writeFile(this.url, JSON.stringify(data, null, 2));
                console.log(data[found]);
                return data[found];
            } else{
                return { error: true }
            }
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = FileSystem;