let _productsController = null;
let _productsRepository = null;
let _shoppingCartController = null;
let _shoppingCartRepository = null;

const singleton = () => {
    const _self = this;

    // PRODUCTS
    _self.setProductsController = (productsController) => {
        _productsController = productsController;
    };
    _self.setProductsRepository = (productsRepository) => {
        _productsRepository = productsRepository;
    };
    _self.productsController = () => _productsController;
    _self.productsRepository = () => _productsRepository;

    // SHOPPING CART
    _self.setShoppingCartController = (shoppingCartController) => {
        _shoppingCartController = shoppingCartController;
    };
    _self.setShoppingCartRepository = (shoppingCartRepository) => {
        _shoppingCartRepository = shoppingCartRepository;
    };
    _self.shoppingCartController = () => _shoppingCartController;
    _self.shoppingCartRepository = () => _shoppingCartRepository;


    return _self;
};

module.exports = singleton;