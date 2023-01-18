const fs = require('fs');
const path = require('path');
const {nanoid} = require('nanoid');

const seedProductsFromJson = (productsRepository) => {
    const productsJsonPath = path.join(__dirname, '../data/products.json')
    fs.readFile(productsJsonPath, "utf-8", async (error, data) => {
        if(data){
            let products = JSON.parse(data);
        
            const seedProducts = async () => {
                products = products.map(({name, price}) => {
                    const id = nanoid(12);
                    return {productId: id, productName: name, productPrice: price};
                })
                await productsRepository.addProducts(products);
            }

            await seedProducts();
        }
        else if(error){
            console.error(error)
            throw new Error(error);
        }
    })
}

module.exports = seedProductsFromJson;