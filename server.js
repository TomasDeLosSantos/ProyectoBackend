const express = require('express');
const MongoProduct = require('./DAOs/MongoProduct');
const MongoCart = require('./DAOs/MongoCart');
const MongoUsers = require('./DAOs/MongoUsers');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const { createHash } = require('crypto');

if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}

const { Router } = express;
const app = express();
const productRouter = Router();
const cartRouter = Router();
const authRouter = Router();
const PORT = process.env.PORT || 8080;
const data = new MongoProduct();
const cart = new MongoCart();
const mongoUsers = new MongoUsers();

let admin = true;

const adminCheck = (req, res, next) => {
    if(admin == true){
        next();
    } else{
        res.send({ error: -1, description: `Route not authorized`})
    }
}

// PASSPORT
const passwordCheck = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}

passport.use('login', new LocalStrategy(
    async (username, password, done) => {
        let user = await mongoUsers.getByEmail(username);
        if(user[0] != undefined){
            if(passwordCheck(user[0], password)){
                return done(null, user[0]);
            } else{
                return done(null, false);
            }
        } else{
            return done(null, false);
        }
    }
));

passport.use('signup', new LocalStrategy({
    passReqToCallback: true
}, async (req, username, password, done) => {
        let user = await mongoUsers.getByEmail(username);
        if(user[0] != undefined){
            console.log('User Already Exists');
            return done(null, false);
        } else{
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/static', express.static(__dirname + '/public'));


app.use(session({
    // store: MongoStore.create({ mongoUrl: config.mongoLocal.cnxStr }),
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://tomas:tomasmongo1234@cluster0.zjndnkl.mongodb.net/ecommerce?retryWrites=true&w=majority' }),
    secret: "shhhhhhhhhhhhhhhhhhhhh",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 30000
    }
}))

app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/auth', authRouter);
app.use(passport.initialize());
app.use(passport.session());

authRouter.get('/logged', async (req, res) => {
    // console.log(req.session.username);
    if(req.session.username != undefined) {
        const user = await mongoUsers.getByEmail(req.session.username);

        res.json({login: 1, username: req.session.username, user: user});
    } else {
        res.json({login: 0});
    }
})

authRouter.post('/login', passport.authenticate('login') , (req, res) => {
    req.session.username = req.body.username;
    res.json({login: 1, email: req.body.username});
})

authRouter.post('/register', passport.authenticate('signup') , (req, res) => {
    if(req.body == {user: 'exists'}){
         res.json({user: 'exists'});
    } else{
        req.session.username = req.body.email;
        res.json({login: 1, email: req.body.email});
    }
})

authRouter.get('/logout', (req, res) => {
    let user = req.session.username;
    req.session.destroy(err => {
        if (err) {
            res.json({ login: 0 })
        } else {
            res.json({login: 0, username: user})
        }
    })
})



productRouter.get('/', async (req,res) => {
    let products = await data.getAll();
    res.json(products);
})

productRouter.post('/', adminCheck, async (req,res) => {
    try {
        data.save(req.body);
        res.json(req.body.title);
    } catch (error) {
        console.error(error);
        res.json(false);
    }
})

productRouter.put('/:id', adminCheck, async (req, res) => {
    let id = req.params.id;
    let body = req.body;
    try {
        let response = await data.update(id, body);
        res.json(response.title);
    } catch (error) {
        console.error(error);
    }
})

productRouter.delete('/:id', adminCheck, async (req, res) => {
    // let products = await data.getAll();
    let book = await data.getById(req.params.id);
    if(book){
        await data.deleteById(req.params.id);
        res.json(book.title);
    } else{
        res.send({ error: "Not Found" });
    }
})

cartRouter.post('/', async (req, res) => {
    try {
        // let data = await cart.getAll();
        let newCart = {
            timestamp: new Date().toLocaleString(), 
            products: [] 
        }
        
        res.send(await cart.save(newCart));

    } catch (error) {
        console.error(error);
    }
})

cartRouter.delete('/:id', async (req, res) => {
    try {
        res.send(await cart.deleteById(req.params.id));
    } catch (error) {
        console.error(error);
    }
})

cartRouter.get('/:id/products', async (req, res) => {
    try {
        let data = await cart.getById(req.params.id);
        res.send(data.products);
    } catch (error) {
        console.error(error);
    }
})

cartRouter.post('/:id/products', async (req, res) => {
    try {
        res.json(await cart.addToCart(req.body, req.params.id));
    } catch (error) {
        console.error(error);
    }
})

cartRouter.delete('/:id/products/:id__prod', async (req, res) => {
    try {
        res.json(await cart.deleteFromCart(req.params.id, req.params.id__prod));
    } catch (error) {
        console.error(error);
    }
})


app.listen(PORT, () => {
    console.log(`Server Running at ${PORT}`);
})