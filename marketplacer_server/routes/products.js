var express = require('express');
var router = express.Router();
const factory = require('../utils/factory')();

/* GET users listing. */
router.get('/', factory.productsController().getProducts);

module.exports = router;
