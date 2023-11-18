import { Router } from 'express';
import cartRouter from "./cart.router.js"
import productsRouter from "./products.router.js"

const router = Router();

const privateRouter = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

const publicRouters = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/profile');
    }
    next();
}

router.use('/api', privateRouter, cartRouter, productsRouter);

router.get("/", publicRouters, (req, res) => {
    res.redirect('/login');
})

router.get('/profile', privateRouter, (req, res) => {
    console.log(req.session.user)
    res.render('profile', { title: 'Profile', user: req.session.user });
});

router.get('/login', publicRouters, (req, res) => {
    res.render('login', { title: 'Login' });
});

router.get('/register', publicRouters, (req, res) => {
    res.render('register', { title: 'Register' });
});

export default router;
