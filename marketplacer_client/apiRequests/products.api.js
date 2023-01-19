const axios = require('../config/axios');

const productsApi = () => {
    const api = {
        getProducts: async () => {
            try{
                const response = await axios({
                    url: "products",
                    method: "get"
                });
                const products = response.data.data.products;
                return products;
            }
            catch(error){
                throw new Error(error);
            }
        }
    }

    return api;
}

module.exports = productsApi;