import express from "express"
import expressSession from 'express-session';
import MongoStore from 'connect-mongo';
import path from "path"
import exphbs from 'express-handlebars';
import { __dirname } from './utils.js';
import indexRouter from "./routers/index.router.js"
import sessionsRouter from "./routers/sessions.router.js"
import passport from 'passport';
import { init as initPassportConfig } from './config/passport.config.js';
import dotenv from 'dotenv';


const app = express();

dotenv.config();


app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.URI,
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

initPassportConfig();
app.use(passport.initialize());
app.use(passport.session());

app.use((error, req, res, next) => {
    const errorMessage = `An error was recorded: ${error}`;
    console.log(errorMessage);
    res.status(500).json({status: 'error', errorMessage})
})
app.use('/', indexRouter);
app.use('/auth', sessionsRouter);

export default app;