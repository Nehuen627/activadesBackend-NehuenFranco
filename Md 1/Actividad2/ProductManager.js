const fs = require('fs');

const readDocument = (path) => {
    if(fs.existsSync(path)){
        let content = fs.readFileSync(path, 'utf-8');
        if (!content) {
            return [];
        }
        return JSON.parse(content);
    } else {
        console.error("no hay archivo al cual leer")
    }
}
class ProductManager{
    constructor(path) {
        this.path = path;
        this.nextId = 1;
    }

    addProduct(product) {
        let arrayProducts = readDocument(this.path);
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
        fs.writeFileSync(this.path, JSON.stringify(arrayProducts));
    }

    getProducts() {
        let products = readDocument(this.path);
        return products;
    }
    getProductById(id) {
        let arrayProducts = readDocument(this.path);
        const product = arrayProducts.find(product => product.id === id);
        
        if (!product) {
            console.warn("No hay un producto con esa Id");
            return null;
        }
        
        return product;
    }
    updateProduct(id, updatedProduct) {
        let arrayProducts = readDocument(this.path);
        const index = arrayProducts.findIndex(product => product.id === id);

        if (index === -1) {
            console.warn("No hay un producto con esa Id");
            return;
        }

        arrayProducts[index] = { ...arrayProducts[index], ...updatedProduct, id: id }
        fs.writeFileSync(this.path, JSON.stringify(arrayProducts));

    }
    deleteProduct(id) {
        let arrayProducts = readDocument(this.path);
        const index = arrayProducts.findIndex(product => product.id === id);

        if (index === -1) {
            console.warn("No hay un producto con esa Id");
            return;
        }
        
        arrayProducts.splice(index, 1)
        fs.writeFileSync(this.path, JSON.stringify(arrayProducts));
    }
}

const products_prueba = new ProductManager("./Products1.json");
console.log(products_prueba.getProducts())
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
products_prueba.addProduct(newProduct) 
products_prueba.addProduct(newProduct2) 
products_prueba.addProduct(newProduct3)
console.log(products_prueba.getProducts())
console.log(products_prueba.getProductById(2))

products_prueba.updateProduct(2, { title: "updated title" });
console.log(products_prueba.getProductById(2));

products_prueba.deleteProduct(2);
console.log(products_prueba.getProducts());