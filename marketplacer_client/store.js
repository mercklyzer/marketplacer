let _username = '';
let _products = [];
let _shoppingCart = {};

const store = () => {
    const _self = this;

    _self.setUsername = (username) => {
        _username = username;
    }

    _self.setProducts = (products) => {
        _products = products;
    }

    _self.setShoppingCart = (shoppingCart) => {
        _shoppingCart = shoppingCart;
    }
    
    _self.username = () => _username;
    _self.shoppingCart = () => _shoppingCart;
    _self.products = () => _products;

    return _self;
}


module.exports = store;
