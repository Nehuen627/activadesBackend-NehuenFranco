import express from "express"
import expressSession from 'express-session';
import MongoStore from 'connect-mongo';
import path from "path"
import exphbs from 'express-handlebars';
import { __dirname } from './utils.js';
import { URI } from "./db/mongodb.js"
import indexRouter from "./routers/index.router.js"
import sessionsRouter from "./routers/sessions.router.js"

const app = express();

const sessionSecret = "zIi3Fh1uBl2oCi5YqN2Ep5Y8iQZUMNQG"
app.use(expressSession({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: URI,
        mongoOptions: {},
        ttl: 120,
    }), 
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));


const hbs = exphbs.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    },
    helpers: {
        eq: function (a, b) {
            return a === b;
        },
    },
});

app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use((error, req, res, next) => {
    const errorMessage = `An error was recorded: ${error}`;
    console.log(errorMessage);
    res.status(500).json({status: 'error', errorMessage})
})
app.use('/', indexRouter);
app.use('/auth', sessionsRouter);

export default app;