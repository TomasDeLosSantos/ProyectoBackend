const { createTransport } = require('nodemailer');

const sendSingupMail = async (req, res) => {
    const transporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.SEND_MAIL,
            pass: process.env.SEND_PASS
        }
    })

    const mailOptions = {
        form: 'Backend Project',
        to: process.env.RECEIVE_MAIL,
        subject: `New User signed up!`,
        html: ` <h2>${req.body.username} data:</h2>
                <ul>
                    <li>Name: ${req.body.name}</li>
                    <li>Address: ${req.body.address}</li>
                    <li>Age: ${req.body.age}</li>
                    <li>Phone: ${req.body.phone}</li>
                </ul>`
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        res.send({ done: 1 });
    } catch (error) {
        console.log(err)
    }

}

const sendPurchaseMail = async (req, res) => {
    const transporter = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.SEND_MAIL,
            pass: process.env.SEND_PASS
        }
    })

    const mailOptions = {
        form: 'Backend Project',
        to: process.env.RECEIVE_MAIL,
        subject: `New order created!`,
        html: ` <h2>${req.body.username} cart:</h2>
                <h4>Total: ${req.body.price}</h4>
                <ul>
                    ${req.body.products.map(p => `<li>x${p.quant} ${p.title} </li>`)}
                </ul>`
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        res.send({ done: 1 });
    } catch (error) {
        console.log(err)
    }
}

module.exports = { sendSingupMail, sendPurchaseMail }