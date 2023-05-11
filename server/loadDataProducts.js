import fs from 'fs';

const loadDataProducts = () => {

    const products = [];

    const filenames = fs.readdirSync('./data');
  
    filenames.forEach((file) => {

        const jsonData = fs.readFileSync('./data/'+file, 'utf8');
        let data = JSON.parse(jsonData);
  
        products.push(data.data)
        
    });
    
    return products;
  
}

export default loadDataProducts;