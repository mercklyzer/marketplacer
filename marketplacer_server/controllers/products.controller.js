const Ok = require("../httpcodes/Ok");

const productsController = (productsRepository) => {
    const controller = {
        getProducts: async (req, res, next) => {
            try {
                const products = await productsRepository.getProducts();
                return next(new Ok({products}))
            }
            catch(error){
                console.error(error);
                return next(error);
            }
        },
    };

    return controller;
};

module.exports = productsController;