const crypto = require('crypto');

class Payeer {
    constructor(m_shop, m_key) {
        this.m_shop = m_shop;  
        this.m_key = m_key;    
    }

    async generatePayment(m_orderid, m_amount, m_curr, m_desc) {
        const m_sign = this.generateSignature(m_orderid, m_amount, m_curr, Buffer.from(m_desc).toString('base64'));

        const form = `https://payeer.com/merchant/?m_shop=${this.m_shop}&m_orderid=${m_orderid}&m_amount=${m_amount}&m_curr=${m_curr}&m_desc=${Buffer.from(m_desc).toString('base64')}&m_sign=${m_sign}&lang=en`;

        return form;
    }

    validatePaymentStatus(paymentData) {
        // const trustedIps = ['185.71.65.92', '185.71.65.189', '149.202.17.210'];
        // // IP doğrulaması
        // if (!trustedIps.includes(paymentData.ip)) {
        //     throw new Error('Invalid IP');
        // }

        const signHash = this.generatePaymentStatusSignature(paymentData);

        if (paymentData.m_sign === signHash && paymentData.m_status === 'success') {
            return true;
        } else {
            return false;
        }
    }

    generateSignature(m_orderid, m_amount, m_curr, m_desc) {
        const arHash = [
            this.m_shop,
            m_orderid,
            m_amount,
            m_curr,
            m_desc,
            this.m_key
        ];

        const sign = crypto.createHash('sha256')
                           .update(arHash.join(':'))
                           .digest('hex')
                           .toUpperCase();

        return sign;
    }

    generatePaymentStatusSignature(paymentData) {
        const arHash = [
            paymentData.m_operation_id,
            paymentData.m_operation_ps,
            paymentData.m_operation_date,
            paymentData.m_operation_pay_date,
            paymentData.m_shop,
            paymentData.m_orderid,
            paymentData.m_amount,
            paymentData.m_curr,
            paymentData.m_desc,
            paymentData.m_status
        ];

        if (paymentData.m_params) {
            arHash.push(paymentData.m_params);
        }

        arHash.push(this.m_key);

        return crypto.createHash('sha256')
                     .update(arHash.join(':'))
                     .digest('hex')
                     .toUpperCase();
    }
}

const express = require('express');
const bodyParser = require('body-parser');
const { default: axios } = require('axios');

const app = express();

app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('multer')().none());
app.use(async (req, res, next) => {
    console.log(req.body);
    console.log(req.url, req.method);
    next();
});
const payeer = new Payeer('XXXXXX', 'XXXXXXXX');  

app.get('/payeer_2175693165.txt', (req, res) => {
    res.send('2175693165');
});

app.get('/', async (req, res) => {
    const m_orderid = '123456';      
    const m_amount = '0.01';      
    const m_curr = 'RUB';           
    const m_desc = "Add funds to account";  

    const form = await payeer.generatePayment(m_orderid, m_amount, m_curr, m_desc);
    console.log(form);
    res.json({ form });
});

app.post('/status', (req, res) => {
    try {

        console.log(req.body);
        const isValid = payeer.validatePaymentStatus(req.body);
        console.log(isValid);

        if (isValid) {
            res.send(`${req.body.m_orderid}|success`);
        } else {
            res.send(`${req.body.m_orderid}|error`);
        }
    } catch (error) {
        res.status(500).send('Payment validation failed');
    }
});

app.listen(80, () => {
    console.log('Server running on port 3000');
});
