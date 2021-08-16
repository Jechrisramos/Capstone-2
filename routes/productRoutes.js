const express = require("express");
const router = express.Router();

const { verifyToken, verifyAdmin } = require("../auth");

/* --Controller-- */
const { getAllProducts, productView, createProduct, updateProduct, archiveProduct, restoreProduct, addToCart } = require("../controllers/productController");

/* --Routes-- */
router.get('/', getAllProducts); // open for public
router.get('/product/:id', productView); // open for public
router.post('/create', verifyToken, verifyAdmin, createProduct);
router.put('/:id/update', verifyToken, verifyAdmin, updateProduct);
router.delete('/archive/:id', verifyToken, verifyAdmin, archiveProduct);
router.put('/restore/:id', verifyToken, verifyAdmin, restoreProduct);
router.post('/:id/add-to-cart', verifyToken, addToCart);

module.exports = router;