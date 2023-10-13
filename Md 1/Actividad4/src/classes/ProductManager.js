import fs from 'fs';
import { promises as fsp } from 'fs';
import { getNewId } from '../utils.js';

class ProductManager{
    constructor(path) {
        this.path = path;
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

        if (arrayProducts.some(existingProduct => existingProduct.code === product.code)) {
            return;
        }

        if(!product.title || 
            !product.description || 
            !product.price || 
            !product.category || 
            !product.code || 
            !product.stock) {
            console.error(`Some information is missing ${JSON.stringify(product)}`);
            return false;
        } 

        if(product.status != null || undefined){
            product.status = true
        }   
        
        const newProduct = {
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock,
            status: product.status,
            category:product.category,
            id: getNewId(),
        };

        arrayProducts.push(newProduct);
        await fsp.writeFile(this.path, JSON.stringify(arrayProducts));
        return true
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
            return false;
        }
        
        arrayProducts.splice(index, 1)
        await fsp.writeFile(this.path, JSON.stringify(arrayProducts));
        return true
    }
}

export default ProductManager