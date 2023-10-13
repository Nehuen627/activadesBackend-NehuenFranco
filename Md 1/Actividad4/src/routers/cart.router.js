import { Router } from 'express';
import CartManager from '../classes/CartsManager.js';
import { products_prueba } from './products.router.js';

const router = Router();
const cart_prueba = new CartManager("./src/data/carrito.json")

router.post("/carts", async (req, res) => {
    try{
        let { body : data } = req;
        const products = [data]
        let added = await cart_prueba.addCart(products);
        if(added){
            res.status(200).send(products)
        } else {
            res.status(400).send(products)
        }
    } 
    catch (error) {
        console.error("Error adding cart:", error);
        res.status(500).send("Error adding cart.");
    }
})

router.get("/carts/:cid", async (req, res) => {
    const id = req.params.cid;

    try {
        const cart = await cart_prueba.getCartContentById(id)
        if(cart){
            res.status(200).send(cart);
        } else {
            const cartArray = {
                product: "There is no cart by that id"
            }
            res.status(404).send(cartArray);
        }
    } catch (error) {
        console.error("Error finding cart:", error);
        res.status(500).send("Error finding cart.");
    }
})

router.post("/carts/:cid/product/:pid", async (req, res) => {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;
    
    try {
        const product = await products_prueba.getProductById(idProduct); 

        if(product){
            const productsObj = {
                id: product.id,
                quantity: 1
            };
            
            let added = await cart_prueba.addProductToCart(idCart, productsObj);
            
            if(added){
                const cart = await cart_prueba.getCartContentById(idCart);
                res.status(200).send(cart);
            } else {
                res.status(400).send({ message: "Error adding the product to the cart" }); 
            }
        } else {
            console.log("Product not found");
            res.status(404).send({ message: "Product not found" }); 
        }
    }
    catch (error) {
        console.error("Error updating the cart or adding the product:", error);
        res.status(500).send("Error updating the cart or adding the product");
    }
});
export default router;
