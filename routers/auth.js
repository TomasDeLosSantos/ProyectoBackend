const express = require('express');
const passport = require('passport');
const { Router } = express;
const { getLogged, getLogout, postLogin, postRegister, mongoUsers } = require("../controllers/auth");
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const {cart} = require('../controllers/cart');

// PASSPORT
const passwordCheck = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}

passport.use('login', new LocalStrategy(
    async (username, password, done) => {
        let user = await mongoUsers.getByEmail(username);
        if (user[0] != undefined) {
            if (passwordCheck(user[0], password)) {
                return done(null, user[0]);
            } else {
                return done(null, false);
            }
        } else {
            return done(null, false);
        }
    }
));

passport.use('signup', new LocalStrategy({
    passReqToCallback: true
}, async (req, username, password, done) => {
    console.log(username);
    let user = await mongoUsers.getByEmail(username);
    if (user[0] != undefined) {
        console.log('User Already Exists');
        return done(null, false);
    } else {
        const newUser = {
            email: username,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(8), null),
            name: req.body.name,
            address: req.body.address,
            age: req.body.age,
            phone: req.body.phone,
        }

        try {
            let newCart = {
                timestamp: new Date().toLocaleString(),
                products: [],
                id: username
            }
            await cart.save(newCart);
            return done(null, await mongoUsers.save(newUser));
        } catch (error) {
            return done(error);
        }
    }
}
));

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser(async (username, done) => {
    let user = await mongoUsers.getByEmail(username);
    done(null, user)
})


const authRouter = new Router();


authRouter.use(passport.initialize());
authRouter.use(passport.session());    

authRouter.get('/logged', getLogged);

authRouter.get('/logout', getLogout);

authRouter.post('/login', passport.authenticate('login'), postLogin);

authRouter.post('/register', passport.authenticate('signup'), postRegister);

module.exports = { authRouter };