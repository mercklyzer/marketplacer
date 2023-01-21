var express = require('express');
var router = express.Router();
const singleton = require('../utils/singleton')();

/* GET users listing. */
router.get('/:username', singleton.shoppingCartController().getShoppingCartByUsername);
router.post('/:username', singleton.shoppingCartController().addShoppingCartItem);
router.delete('/:username/:shoppingCartItemId', singleton.shoppingCartController().deleteShoppingCartItem);

module.exports = router;
