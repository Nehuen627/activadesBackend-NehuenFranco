import { Router } from 'express';
import passport from 'passport';
import UsersManager from '../dao/UsersManager.js';

const router = Router();

router.post('/sessions/register', passport.authenticate('register', { failureRedirect: '/register' }), async (req, res) => {
    res.redirect('/login');
});

router.post('/sessions/login', passport.authenticate('login', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/api/products');

});

router.post('/sessions/login-github', async (req, res) => {
    try {
        const { body:{ email } } = req;
        let user = req.session.user;
        if (user.email === null) {
            const newUser = await UsersManager.updateData("email", email, req.user._id);
            req.session.user = newUser;
        }
        res.redirect('/api/products');
    } catch (error) {
        res.redirect('/login');
    }
});


router.get('/sessions/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/sessions/github-callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    const user = req.user;

    if (!user.email) {
        req.session.user = user;
        res.redirect('/login-github');
    } else {
        req.session.user = user;
        res.redirect('/api/products');
    }
})
router.get('/sessions/logout', (req, res) => {
    req.session.destroy((error) => {
        res.redirect('/login');
    });
});
router.post('/sessions/changePassword', async (req, res) => {
    try {
        const { body:{ email, password } } = req;
        const exist = await UsersManager.findEmail(email);
        if (exist){
            await UsersManager.updateData("password", password, exist._id);
            res.redirect('/login')
        } else {
            res.redirect('/changePassword');
        }
    }
    catch (error) {
        res.redirect('/changePassword');
    }
})

export default router;
