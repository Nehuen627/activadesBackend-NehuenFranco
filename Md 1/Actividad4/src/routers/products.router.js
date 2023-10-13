import { Router } from 'express';
import ProductManager from '../classes/ProductManager.js';



const router = Router();
export const products_prueba = new ProductManager("./src/data/products.json")
const startAsync = async () => {
    for (let i = 1; i <= 10; i++) {
        let code = 'abc' + '1'.repeat(i);
        let newProduct = {
            title: "producto prueba",
            description: "este es un producto prueba",
            price: 200,
            thumbnail: "sin imagen",
            code: code,
            stock: 25,
            status: true,
            category: "pruebas",
        };

        await products_prueba.addProduct(newProduct);
    }
}

router.get("/products",async (req, res) => {
    const limit = req.query.limit;

    try {
        const products = await products_prueba.getProducts();
        if(limit){
            products.splice(limit);
            console.log(products);
            const productsObj = {
                products: products
            }
            res.send(productsObj);
        } else {
            const productsObj = {
                products: products
            }
            res.status(200).send(productsObj);
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Error fetching products.");
    }
});

router.get("/products/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const products = await products_prueba.getProductById(id)
        if(products){
            const productsObj = {
                product: products
            }
            res.send(productsObj);
        } else {
            const productsObj = {
                product: "no existe el producto con esa id"
            }
            res.status(200).send(productsObj);
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Error fetching products.");
    }
});

router.post("/products", async (req, res) => {
    try {
        let { body: data } = req;
        data = {
            ...data,
        };
        let added = await products_prueba.addProduct(data);
        if (added) {
            req.socketServer.emit('newProduct', data);
            res.status(200).json(data);
        } else {
            res.status(400).json({ error: `Error adding the product ${data}` });
        }
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ error: 'Error adding the product' });
    }
});
router.put("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        const products = await products_prueba.getProductById(id)
        if(!products){
            const productsObj = {
                product: "no existe el producto con esa id"
            }
            res.status(404).send(productsObj);
        } else {
            let { body : data } = req;
            data = {
                ...data,
            };
            await products_prueba.updateProduct(id, data);
            const productsNew = await products_prueba.getProductById(id)
            res.status(200).send(productsNew);
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Error fetching products.");
    }
})

router.delete("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        let deleted = await products_prueba.deleteProduct(id);
        if (deleted) {
            req.socketServer.emit('removeProduct', id);
            res.status(200).send(`The product is deleted? : ${deleted}`);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send("Error deleting product");
    }
});
router.get('/realTimeProducts', async (req, res) => {
    req.socketServer.on('connection', (socket) => {
        console.log('Client connected');
    }); 

    try {
        const products = await products_prueba.getProducts();
        res.render('realtimeproducts', { products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Error fetching products.");
    }

});
startAsync();

export default router;
