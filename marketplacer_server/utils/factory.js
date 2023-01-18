let _productsController = null;
let _productsRepository = null;

const factory = () => {
    const _self = this;
    
    _self.setProductsController = (productsController) => {
        _productsController = productsController;
    };

    _self.setProductsRepository = (productsRepository) => {
        _productsRepository = productsRepository;
    };

    _self.productsController = () => _productsController;
    _self.productsRepository = () => _productsRepository;

    return _self;
};

module.exports = factory;