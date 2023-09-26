const fs = require('fs');
const fsp = require('fs').promises;

class ProductManager{
    constructor(path) {
        this.path = path;
        this.nextId = 1;
        this.init();
        this.readDocument = async () => {
            try {
                if (fs.existsSync(this.path)) {
                    let content = await fsp.readFile(this.path, 'utf-8');
                    if (!content) {
                        return [];
                    }
                    return JSON.parse(content);
                } else {
                    console.error("no hay archivo al cual leer");
                    return [];
                }
            } catch (error) {
                console.error(`Error reading document: ${error.message}`);
                return [];
            }
        };
    }
    async init() {
        if (!fs.existsSync(this.path)) {
            await fsp.writeFile(this.path, JSON.stringify([]));
        }
    }
    

    async addProduct(product) {
        let arrayProducts = await this.readDocument();
        const maxId = Math.max(...arrayProducts.map(p => p.id), 0);
        this.nextId = maxId + 1;

        if (arrayProducts.some(existingProduct => existingProduct.code === product.code)) {
            console.error("The product is already added");
            return;
        }

        if(!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            return console.error(`Some information is missing`);
        } 
        
        const newProduct = {
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock,
            id: this.nextId++,
        };

        arrayProducts.push(newProduct);
        await fsp.writeFile(this.path, JSON.stringify(arrayProducts));
    }

    async getProducts() {
        let products = await this.readDocument();
        return products;
    }
    async getProductById(id) {
        let arrayProducts = await this.readDocument();
        const product = arrayProducts.find(product => product.id === id);
        
        if (!product) {
            console.warn("No hay un producto con esa Id");
            return null;
        }
        
        return product;
    }
    async updateProduct(id, updatedProduct) {
        let arrayProducts = await this.readDocument();
        const index = arrayProducts.findIndex(product => product.id === id);

        if (index === -1) {
            console.warn("No hay un producto con esa Id");
            return;
        }

        arrayProducts[index] = { ...arrayProducts[index], ...updatedProduct, id: id }
        await fsp.writeFile(this.path, JSON.stringify(arrayProducts));

    }
    async deleteProduct(id) {
        let arrayProducts = await this.readDocument();
        const index = arrayProducts.findIndex(product => product.id === id);

        if (index === -1) {
            console.warn("No hay un producto con esa Id");
            return;
        }
        
        arrayProducts.splice(index, 1)
        await fsp.writeFile(this.path, JSON.stringify(arrayProducts));
    }
}


const startAsync = async () => {
    const products_prueba = new ProductManager("./Products1.json");
    console.log(await products_prueba.getProducts());
    
    let newProduct = {
        title: "producto prueba",
        description: "este es un producto prueba",
        price: 200,
        thumbnail: "sin imagen",
        code: "abc123",
        stock: 25,
    }
    let newProduct2 = {
        title: "producto prueba",
        description: "este es un producto prueba",
        price: 200,
        thumbnail: "sin imagen",
        code: "abc1234",
        stock: 25,
    }
    let newProduct3 = {
        title: "producto prueba",
        description: "este es un producto prueba",
        price: 200,
        thumbnail: "sin imagen",
        code: "abc12345",
        stock: 25,
    }

    await products_prueba.addProduct(newProduct);
    await products_prueba.addProduct(newProduct2);
    await products_prueba.addProduct(newProduct3);
    
    console.log("productos:")
    console.log(await products_prueba.getProducts());

    console.log("producto por id:")
    console.log(await products_prueba.getProductById(2));

    console.log("updated product:")
    await products_prueba.updateProduct(2, { title: "updated title" });
    console.log(await products_prueba.getProductById(2));

    console.log("delete product:")
    await products_prueba.deleteProduct(2);
    console.log(await products_prueba.getProducts());
}

startAsync();

