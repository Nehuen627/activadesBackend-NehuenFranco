class ProductManager{
    constructor() {
        this.products = [];
        this.nextId = 1;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (this.products.some(product => product.code === code)) {
            console.warn("The product is already added");
            return;
        }

        if(!title, !description, !price, !thumbnail, !code, !stock ){
            return console.log(`Some information is missing`)
        } 
        const newProduct = {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock,
            id: this.nextId++,
        };

        this.products.push(newProduct);
    }

    getProducts() {
        return this.products
    }
    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        
        if (!product) {
            console.warn("No hay un producto con esa Id");
            return null;
        }
        
        return product;
    }
}

const products_prueba = new ProductManager();

console.log(products_prueba.getProducts())

products_prueba.addProduct("producto prueba", "este es un producto prueba", 200, "sin imagen", "abc123", 25) // ORIGINAL
products_prueba.addProduct("producto prueba", "este es un producto prueba", 200, "sin imagen", "abc123", 25) // COPIA PARA FUNCIONAMIENTO DE DUPLICADO
products_prueba.addProduct("producto prueba", "este es un producto prueba", 200, "sin imagen", "abc1234", 25) // OTRO PARA FUNCIONAMIENTO DE GETBYID (TRUE)
console.log(products_prueba.getProducts())
console.log(products_prueba.getProductById(2))
console.log(products_prueba.getProductById(3))