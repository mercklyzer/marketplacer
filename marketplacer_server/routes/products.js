var express = require('express');
var router = express.Router();
const singleton = require('../utils/singleton')();

/* GET users listing. */
router.get('/', singleton.productsController().getProducts);

module.exports = router;
