import fs from 'fs';

const loadData = () => {

    const products = [];

    const filenames = fs.readdirSync('./data');
  
    filenames.forEach((file) => {

        const jsonData = fs.readFileSync('./data/'+file, 'utf8');
        let data = JSON.parse(jsonData);
  
        if (data?.data?.GeneralInfo && data?.data?.GeneralInfo?.GTIN[0]) {
            data = data.data;

            products.push({
                //IcecatId: data.GeneralInfo.IcecatId,
                GTIN: data.GeneralInfo.GTIN[0],
                productname: data.GeneralInfo.ProductName,
                BrandPartCode: data.GeneralInfo.BrandPartCode
                //brand: data.GeneralInfo.Brand,
                //title: data.GeneralInfo.Title,
                //category: data.GeneralInfo.Category,
                //description: data.GeneralInfo.Description.LongDesc
            })
        }
      
    });
    
    return products;
  
}

export default loadData;