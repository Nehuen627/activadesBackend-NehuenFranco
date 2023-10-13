import express from "express"
import path from "path"
import cartRouter from "./routers/cart.router.js"
import productsRouter from "./routers/products.router.js"
import handlebars from 'express-handlebars'
import { __dirname } from "./utils.js"
import { products_prueba } from "./routers/products.router.js"
import { socketServer } from "./server.js"
import bodyParser from 'body-parser';
import cors from 'cors';


const app = express();
// lograr funcionar server socket.io
app.use(cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');



app.get('/', async (req , res) => {
    try {
        const products = await products_prueba.getProducts();
        res.render('home', { products: products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Error fetching products.");
    }
});

app.use((error, req, res, next) => {
    const errorMessage = `An error was recorded: ${error}`;
    console.log(errorMessage);
    res.status(500).json({status: 'error', errorMessage})
})
app.use((req, res, next) => {
    req.socketServer = socketServer;
    next();
});

app.use('/api', cartRouter, productsRouter);

export default app
