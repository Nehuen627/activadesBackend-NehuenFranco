import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import UsersManager from '../dao/UsersManager.js';
import { Exception } from '../utils.js';
import userModel from "../dao/models/user.model.js";


const opts = {
    usernameField: 'email',
    passReqToCallback: true,
};


export const init = () => {
    passport.use('register', new LocalStrategy(opts, async (req, email, password, done) => {
        try {
            const isEmailUsed = await UsersManager.findEmail(email)
            if(isEmailUsed){
                return done(null, false, { message: "There is a user already created with that email" });
            } else {
                const data = req.body 
                const newUser = await UsersManager.addUser(data)
                done(null, newUser);
            }
        }
        catch(error) {
            return done(error, false, { message: `Error: ${error.message}` });
        }
    }));
    passport.use('login', new LocalStrategy(opts, async (req, email, password, done) => {
        try {
            const emailAdmin = process.env.ADMIN_EMAIL
            const passwordAdmin = process.env.ADMIN_PASSWORD
            if(email === emailAdmin && password === passwordAdmin){
                const user = {
                    _id: "admin",
                    firstName: "Admin",
                    lastName: "Coder",
                    rol: "Admin",
                    age: "AdminAge",
                    email: email
                }
                done(null, user);
            } else {
                const user = await UsersManager.getUserData(email, password);
                if(user === "Email or password invalid") {
                    return done(new Exception("Email or password invalid", 401))
                } else {
                    done(null, user);
                }
            }
        }
        catch(error) {
            done(new Exception(`Error: ${error.message}`, 500));
        }
    }));

    passport.use('github', new GithubStrategy({
        clientID: process.env.CLIENT_ID, 
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/sessions/github-callback", 
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile._json.email;
            const githubId = profile.id;

            if (!email) {
                const userWithGithubId = await UsersManager.findUserByGithubId(githubId);

                if (userWithGithubId) {
                    return done(null, userWithGithubId);
                }
    
                const data = {
                    firstName: profile._json.name,
                    lastName: '',
                    email: null,
                    age: '',
                    password: '',
                    provider: 'Github',
                    githubId: githubId, 
                };
    
                const newUser = await UsersManager.addGithubUser(data);
                return done(null, newUser);
            }
    
            let user = await UsersManager.findEmail(email);
            if (user) {
                return done(null, user);
            }
            const data = {
                firstName: profile._json.name,
                lastName: '',
                email: email,
                age: '',
                password: '',
                provider: 'Github',
            };
    
            const newUser = await UsersManager.addGithubUser(data);
            done(null, newUser);
        } catch (error) {
            done(error, null);
        }
    }));
    

    
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    
    passport.deserializeUser(async (id, done) => {
        if (id === "admin") {
            const adminUser = {
                _id: "admin",
                firstName: "Admin",
                lastName: "Coder",
                rol: "Admin",
                age: "AdminAge",
                email: "adminCoder@coder.com"
            };
            return done(null, adminUser);
        }
    
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } 
        catch (error) {
            done(error, null);
        }
    });
}