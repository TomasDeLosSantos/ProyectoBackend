const MongoUsers = require('../DAOs/MongoUsers');
const mongoUsers = new MongoUsers();

const getLogged = async (req, res) => {
    if (req.session.username != undefined) {
        const user = await mongoUsers.getByEmail(req.session.username);

        res.json({ login: 1, username: req.session.username, user: user });
    } else {
        res.json({ login: 0 });
    }
}

const getLogout = (req, res) => {
    let user = req.session.username;
    req.session.destroy(err => {
        if (err) {
            res.json({ login: 0 })
        } else {
            res.json({ login: 0, username: user })
        }
    })
}

const postLogin = (req, res) => {
    req.session.username = req.body.username;
    res.json({ login: 1, email: req.body.username });
}

const postRegister = (req, res) => {
    if (req.body == { user: 'exists' }) {
        res.json({ user: 'exists' });
    } else {
        req.session.username = req.body.email;
        res.json({ login: 1, email: req.body.email });
    }
}

module.exports = { getLogged, getLogout, postLogin, postRegister, mongoUsers }