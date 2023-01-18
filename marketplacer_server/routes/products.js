var express = require('express');
var router = express.Router();

/* GET users listing. */
const productsRouter = (productsRepository) => {
    router.get('/', function(req, res, next) {
      res.status(200).json({product: 'good'});
    });

    return router;
}


module.exports = productsRouter;
