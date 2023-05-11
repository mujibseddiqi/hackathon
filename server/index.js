import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: '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',
});
const openai = new OpenAIApi(configuration);

try {

    const promt = `Find product with sku 9879879 from the folowing products:

    Product: Test product1 sku 1236548

    Product: Test product2 sku 4654546

    Product: Test product3 sku 9879879

    Product: Test product4 sku 3213213
    `;

    const completion = await openai.createCompletion({
        model: "text-curie-001",
        prompt: promt,
    });
    
    console.log(completion.data.choices[0].text);
} catch (error) {
    console.log(error);
}
