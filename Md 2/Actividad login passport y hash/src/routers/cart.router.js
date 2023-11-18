import { Router } from 'express';
import CartManager from '../dao/CartManager.js';
import productsManager from '../dao/ProductsManager.js'
import cartsModel from '../dao/models/carts.model.js';


const router = Router();

router.post("/carts", async (req, res) => {
    try {
        let { body: data } = req;
        const cart = await CartManager.addCart(data);

        if (cart) {
            res.status(201).send({
                message: "Cart created successfully",
                cart: cart
            });
        } else {
            res.status(404).send("Cart not created.");
        }
    } catch (error) {
        console.error("Error adding cart:", error);
        res.status(500).send("Error adding cart.");
    }
});

router.get("/carts/:cid", async (req, res) => {
    const id = req.params.cid;

    try {
        const cart = await CartManager.getCartContentById(id);
        if (cart) {
            const cartData = await cartsModel.findOne({ _id: id });
            
            if (req.headers.accept && req.headers.accept.includes("application/json")) {
                res.status(200).json(cartData);
            } else {
                res.render('cart', { cart: cartData });
            }
        } else {
            if (req.headers.accept && req.headers.accept.includes("application/json")) {
                res.status(404).json({ message: "There is no cart by that id" });
            } else {
                res.status(404).send({ message: "There is no cart by that id" });
            }
        }
    } catch (error) {
        console.error("Error finding cart:", error);
        if (req.headers.accept && req.headers.accept.includes("application/json")) {
            res.status(500).json({ message: "Error finding cart" });
        } else {
            res.status(500).send("Error finding cart.");
        }
    }
})

router.post("/carts/:cid/product/:pid", async (req, res) => {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;

    try {
        const product = await productsManager.getProductById(idProduct);

        if (product) {
            const productsObj = {
                productId: idProduct,
                quantity: 1
            };

            const updatedCart = await CartManager.addProductToCart(idCart, productsObj);

            if (updatedCart) {
                res.redirect(`/api/carts/${idCart}`);
            } else {
                res.status(400).send({ message: "Error adding the product to the cart" });
            }
        } else {
            console.log("Product not found");
            res.status(404).send({ message: "Product not found" });
        }
    } catch (error) {
        console.error("Error updating the cart or adding the product:", error);
        res.status(500).send("Error updating the cart or adding the product");
    }
});

router.delete("/carts/:cid/product/:pid", async (req, res) => {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;
    
    try {
        const cart = await CartManager.getCartContentById(idCart);
        
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

        const existingProductIndex = cart.products.findIndex(product => product.productId._id.toString() === idProduct.toString());

        
        if (existingProductIndex !== -1) {
            cart.products.splice(existingProductIndex, 1);
            await cart.save();
            return res.status(200).send({ message: "Product deleted" });
        } else {
            return res.status(404).send({ message: "Product not found in the cart" });
        }
    } catch (error) {
        console.error("Error updating the cart or deleting the product:", error);
        res.status(500).send("Error updating the cart or deleting the product");
    }
});

router.put("/carts/:cid", async (req, res) => {
    const idCart = req.params.cid;
    const products = req.body;

    try {
        const updatedCart = await CartManager.updateProductsArrayOfCart(idCart, products);

        if (updatedCart) {
            res.status(200).send({ message: "Products in the cart updated", cart: updatedCart });
        } else {
            res.status(400).send({ message: "Error updating the products in the cart" });
        }
    } catch (error) {
        console.error("Error updating the cart or the products:", error);
        res.status(500).send("Error updating the cart or the products");
    }
})

router.put("/carts/:cid/product/:pid", async (req, res) => {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;
    const { quantity } = req.body; 

    try {
        const updatedCart = await CartManager.updateProductQuantityToCart(idCart, idProduct, quantity);

        if (updatedCart) {
            res.status(200).send({ message: "Product quantity in the cart updated", cart: updatedCart });
        } else {
            res.status(400).send({ message: "Error updating the product quantity in the cart" });
        }
    } catch (error) {
        console.error("Error updating the cart or the product quantity:", error);
        res.status(500).send("Error updating the cart or the product quantity");
    }
})

router.delete("/carts/:cid", async (req, res) => {
    const idCart = req.params.cid;
    try {
        const updatedCart = await CartManager.deleteProductsOfCart(idCart);

        if (updatedCart) {
            res.status(200).send({ message: "All products deleted from the cart", cart: updatedCart });
        } else {
            res.status(400).send({ message: "Error deleting the products from the cart" });
        }
    } catch (error) {
        console.error("Error updating the cart or deleting the products:", error);
        res.status(500).send("Error updating the cart or deleting the products");
    }
})

router.get("/carts", async (req, res) => {
    try {
        const carts = await CartManager.getCarts();
        for (let i = 0; i < carts.length; i++) {
            const element = carts[i];
            element.title = i;
        }
        if (carts) {
            res.render('cartsList', { carts });
        } else {
            res.status(400).send({ message: "No carts found" })
        }
    }
    catch (error) {
        console.error("Error getting carts:", error);
        res.status(500).send("Error getting carts");
    }
})

export default router;
