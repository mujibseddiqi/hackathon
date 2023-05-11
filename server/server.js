import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import { Configuration, OpenAIApi } from "openai";

import loadData from './loadData.js';
import loadDataProducts from './loadDataProducts.js';

const context = loadData();
const products = loadDataProducts();

const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();

app.use(express.json({ extended: true, limit: '10mb' }));

const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    const { query: { q } } = req;
    const qt = 'Give me GTIN of product with productname s20 based on the data';

    const promt = `${ JSON.stringify(context) }

    ${qt}
    `;

    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: promt,
    });

    const GTIN = completion.data.choices[0].text.match(/\d{13}/g).join('');

    let product = null
    product = products.find((product) => {
        return product.GeneralInfo.GTIN[0] === GTIN;
    })

    res.json({ 
        q: qt,
        answer: completion.data.choices[0].text, 
        context: context, 
        product: product
    });
});

app.post('/q', async (req, res) => {
    const { body: { q } } = req;

    const promt = `${ JSON.stringify(context) }

    ${q}
    `;

    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: promt,
    });

    let GTIN = completion?.data?.choices[0] ? completion?.data?.choices[0]?.text.match(/\d{13}/g) : null;
    GTIN = GTIN && GTIN.join('');

    let product = null
    product = products.find((product) => {
        return product.GeneralInfo.GTIN[0] === GTIN;
    })

    res.json({ 
        q: q,
        answer: completion.data.choices[0].text, 
        context: context, 
        product: product
    });
});

app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
});