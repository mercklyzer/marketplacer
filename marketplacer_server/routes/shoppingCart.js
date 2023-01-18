var express = require('express');
var router = express.Router();
const factory = require('../utils/factory')();

/* GET users listing. */
router.get('/:username', factory.shoppingCartController().getShoppingCartByUsername);
router.post('/:username', factory.shoppingCartController().addShoppingCartItem);
router.delete('/:username/:shoppingCartItemId', factory.shoppingCartController().deleteShoppingCartItem);

module.exports = router;
