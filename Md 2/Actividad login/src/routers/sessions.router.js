import { Router } from 'express';
import UsersManager from '../dao/UsersManager.js';

const router = Router();

router.post('/sessions/register', async (req, res) => {
    try {
        const { body } = req;
        const newUser = await UsersManager.addUser(body);
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ error: error.message });
    }
});

router.post('/sessions/login', async (req, res) => {
    const { body: { email, password } } = req;
    if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
        const user = {
            firstName: "Admin",
            lastName: "Coder",
            rol: "Admin",
            age: "AdminAge",
            email: "adminCoder@coder.com"
        }
        req.session.user = user;
        res.redirect('/api/products');
    } else {
        const user = await UsersManager.getUserData(email, password);
        if("Email or password invalid" === user){
            res.status(401).send(user);
        } else {
            req.session.user = user;
            res.redirect('/api/products');
        }
    }
});

router.get('/sessions/logout', (req, res) => {
    req.session.destroy((error) => {
        res.redirect('/login');
    });
});

export default router;