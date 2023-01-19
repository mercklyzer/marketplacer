const axios = require('../config/axios');

const shoppingCartApi = () => {
    const api = {
        getShoppingCart: async (username) => {
            try{
                const response = await axios.get(`shopping-cart/${username}`);
                const axiosData = response.data;
                const shoppingCart = axiosData.data.shoppingCart;
                return shoppingCart;
            }
            catch(error){
                throw new Error(error.response.data.error);
            }
        },

        deleteShoppingCartItem: async (username, shoppingCartId) => {
            try{
                const response = await axios.delete(`shopping-cart/${username}/${shoppingCartId}`);
                const axiosData = response.data;
                const shoppingCart = axiosData.data.shoppingCart;
                return shoppingCart;
            }
            catch(error){
                throw new Error(error.response.data.error);
            }
        }
    }

    return api;
}

module.exports = shoppingCartApi;