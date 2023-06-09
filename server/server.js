import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

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
app.use(cors());

const port = process.env.PORT || 3001;

app.get('/', async (req, res) => {
    const { query: { q } } = req;
    
    const qt = 'Can u make a nice structure of this data';

    const promt = `${ JSON.stringify(products[4]) }

    ${qt}
    `;

    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: promt,
    });

    console.log(completion.data.choices);

   /*
    const prompt = 'Give me GTIN of product with productname s20?';

    let productData = products.map((product) => {
        const { GTIN, productname, BrandPartCode, Brand } = product?.GeneralInfo ?? {};

        return {
            role: 'system',
            content: `Product name: ${ productname }\nBrandPartCode: ${ BrandPartCode }\nGTIN: ${ GTIN }\nBrand: ${Brand}`,
        }
    });

    const data = searchChatGPT(prompt, [
        { role: 'user', content: 'Give me a product with productname s20 and brand samsung, and give me the GTIN from the data?' },
        ...productData
    ]);

    res.json(data);
    */

    /*
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
    */
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
        return product?.GeneralInfo?.GTIN[0] === GTIN;
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


const searchChatGPT = async (prompt, messages) => {

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
            max_tokens: 100,
            n: 1,
            stop: '\n',
        });
        
        if (response && response.data && response.data.choices && response.data.choices.length > 0) {
            console.log(response.data.choices);

            return response.data.choices;
        } else {
            throw new Error('Unexpected response from OpenAI API');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}