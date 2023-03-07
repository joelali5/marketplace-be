const express = require('express');
const productsController = require('./../controllers/productController');
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route('/top-5-cheap')
  .get(productsController.aliasTopProducts, productsController.getAllProucts);

router  .route('/product-stats').get(productsController.getProductStats);

router
  .route('/')
  .get(authController.protect, productsController.getAllProucts)
  .post(productsController.createProduct)

router
  .route('/:id')
  .get(productsController.getProduct)
  .patch(productsController.updateProduct)
  .delete(authController.protect,
    authController.restrictTo('admin'),
    productsController.deleteProduct
  );

module.exports = router;
