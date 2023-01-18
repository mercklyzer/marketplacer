const productsController = (productsRepository) => {
    const controller = {
        getProducts: async (req, res, next) => {
            try {
                const products = await productsRepository.getProudcts();
                res.status(200).json({data: {
                    products
                }});
            }
            catch(error){
                console.error(error);
                throw new Error(error);
            }
        },
    };

    return controller;
};

module.exports = productsController;