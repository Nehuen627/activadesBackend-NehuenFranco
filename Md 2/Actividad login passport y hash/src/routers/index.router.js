import { Router } from 'express';
import cartRouter from "./cart.router.js"
import productsRouter from "./products.router.js"

const router = Router();

const privateRouter = (req, res, next) => {
    if (!req.session.user || req.session.user.email === null) {
        return res.redirect('/login');
    }
    next();
};


const publicRouters = (req, res, next) => {
    if (req.session.user && req.session.user.email ) {
        return res.redirect('/profile');
    }
    next();
}

router.use('/api', privateRouter, cartRouter, productsRouter);

router.get("/", publicRouters, (req, res) => {
    res.redirect('/login');
})

router.get('/profile', privateRouter, (req, res) => {
    res.render('profile', { user: req.session.user });
});

router.get('/login', publicRouters, (req, res) => {
    res.render('login');
});
router.get('/login-github', (req, res) => {
    res.render('login-github');
});

router.get('/register', publicRouters, (req, res) => {
    res.render('register');
});

router.get('/changePassword', publicRouters, (req, res) => {
    res.render('changePassword');
})

export default router;
