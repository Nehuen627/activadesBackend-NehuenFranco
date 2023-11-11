import { Router } from 'express';
import ProductManager from '../dao/ProductsManager.js';
import productsModel from '../dao/models/products.model.js';


const router = Router();
router.get("/products", async (req, res) => {
    const { limit, page, sort, status, category} = req.query;


    try {
        const options = {
            limit: limit ? parseInt(limit) : 10,
            page: page ? parseInt(page) : 1,
        };

        const filter = {};

        if (category) {
            filter.category = category; 
        }
        if (status) { 
            filter.status = status; 
        }

        if (sort === 'asc' || sort === 'desc') {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }

        const result = await productsModel.paginate(filter, options);

        if (req.accepts('html')) {
            const user = req.session.user
            res.render('products', {
                products: result.docs,
                totalPages: result.totalPages,
                prevLink: result.hasPrevPage ? `/api/products?page=${result.page - 1}&limit=${options.limit}` : null,
                nextLink: result.hasNextPage ? `/api/products?page=${result.page + 1}&limit=${options.limit}` : null,
                user: user
            });
        } else if (req.accepts('json')) {
            const response = {
                status: "success",
                payload: result.docs,
                totalPages: result.totalPages,
                prevPages: result.page - 1,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/products?page=${result.page - 1}&limit=${options.limit}` : null,
                nextLink: result.hasNextPage ? `/products?page=${result.page + 1}&limit=${options.limit}` : null,
            };
            res.status(200).json(response);
        } else {
            res.status(406).send("Not acceptable");
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Error fetching products.");
    }
});

router.get("/products/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        let product;
        if (req.accepts('html')) {
            product = await productsModel.findById(id);
            if (product) {
                return res.render('product-detail', { product });
            }
        }

        product = await ProductManager.getProductById(id);
        if (product) {
            res.json({ product });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Error fetching product" });
    }
});

router.post("/products", async (req, res) => {
    try{
        let { body : data } = req;
        data = {
            ...data,
        };
        let added = await ProductManager.addProduct(data);
        if(added){
            res.status(200).send(data)
        } else {
            res.status(400).send(data)
        }
    } 
    catch (error) {
        console.error("Error adding product:", error);
        res.status(500).send("Error adding product.");
    }
})

router.put("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        const products = await ProductManager.getProductById(id)
        if(!products){
            const productsObj = {
                product: "There is no product by that id"
            }
            res.status(404).send(productsObj);
        } else {
            let { body : data } = req;
            data = {
                ...data,
            };
            await ProductManager.updateProduct(id, data);
            const newProduct = await ProductManager.getProductById(id)
            res.status(200).send(newProduct);
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Error fetching products.");
    }
})

router.delete("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        let deleted = await ProductManager.deletePoduct(id)
        res.status(200).send(`The product is deleted? : ${deleted}`);
    }
    catch (error){
        console.error("Error deleting product:", error);
        res.status(500).send("Error deleting product");
    }
})


export default router;
