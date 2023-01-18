const productsRepository = (knex) => {
    const repository = {
        getProducts: async () => {
            try{
                const products = await knex.raw("CALL getProducts();");
                return products[0][0];
            }
            catch(error){
                console.error(error);
                throw new Error(error);
            }
        },

        addProduct: async (productId, productName, productPrice) => {
            try{
                const product = await knex.raw("CALL addProduct(?,?,?);", [productId, productName, productPrice]);
                return product[0][0];
            }
            catch(error){
                console.error(error);
                throw new Error(error);
            }
        },

        addProducts: async (products) => {
            try {
                const seedProducts = products.map(({productId, productName, productPrice}) => knex.raw("CALL addProduct(?,?,?);", [productId, productName, productPrice]))
                await Promise.all(seedProducts)
            }
            catch(error){
                console.error(error);
                throw new Error(error);
            }
        }
    };

    return repository;
};

module.exports = productsRepository;