import express from "express"
import ProductManager from "./ProductManager.js";
const products_prueba = new ProductManager("./Products1.json")
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
        };

        await products_prueba.addProduct(newProduct);
    }
}

const app = express();

app.get('/', (req , res)=>{
    res.send('Inicio')
});

app.get('/products', async (req, res) => {
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
app.get('/products/:pid', async (req, res) => {
    const id = parseInt(req.params.pid, 10);


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
app.listen(8080,()=>{
    console.log('Servidor escuchando desde el puerto 8080');
});


startAsync();