import fs from 'fs';
import { promises as fsp } from 'fs';
import { getNewId } from '../utils.js';


class CartManager{
    constructor(path){
        this.path= path
        this.init()
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
    
    async addCart(products){
        let arrayCarts = await this.readDocument();

        if (arrayCarts.some(existingCart => existingCart.id === products.id)) {
            console.error("The cart is already created");
            return;
        }

        if(!products) {
            console.error(`There is no product to create the cart`);
            return false;
        } 
        
        const newCart = {
            id: getNewId(),
            products: products,
        };

        arrayCarts.push(newCart);
        console.log(`Cart created with by id: ${newCart.id}`)
        await fsp.writeFile(this.path, JSON.stringify(arrayCarts));
        return true
    }
    async getCartContentById(id){
        let arrayCarts = await this.readDocument();
        const Cart = arrayCarts.find(Cart => Cart.id === id);
        
        if (!Cart) {
            console.warn("There is no cart with that id");
            return null;
        }
        
        return Cart.products;
    }
    

    async addProductToCart(idCart, product) {
        let arrayCarts = await this.readDocument();
        const cart = arrayCarts.find(c => c.id === idCart);
    
        if (!cart) {
            console.error("Cart not found");
            return false;
        }
    
        const existingProductIndex = cart.products.findIndex(p => p.id === product.id);
    
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity++;
        } else {
            product.quantity = 1;
            cart.products.push(product);
        }
    
        const cartIndex = arrayCarts.findIndex(c => c.id === idCart);
        arrayCarts[cartIndex] = cart; 
    
        await fsp.writeFile(this.path, JSON.stringify(arrayCarts));
        return true;
    }
}

export default CartManager