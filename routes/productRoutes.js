const express = require("express");
const router = express.Router(); 

const { verifyToken, verifyAdmin } = require("../auth");

const { writeReview } = require("../controllers/reviewController");

/* --Controller-- */
const { adminGetAllProducts, getAllActiveProducts, productView, categorizedItems, createProduct, updateProduct, archiveProduct, restoreProduct, addToCart } = require("../controllers/productController");

/* --Routes-- */
router.get('/', verifyToken, verifyAdmin, adminGetAllProducts);
router.get('/shop', getAllActiveProducts); // open for public
router.get('/product/:id', productView); // open for public
router.get('/:categoryId/category/', categorizedItems);
router.post('/create', verifyToken, verifyAdmin, createProduct);
router.put('/:id/update', verifyToken, verifyAdmin, updateProduct);
router.delete('/archive/:id', verifyToken, verifyAdmin, archiveProduct);
router.put('/restore/:id', verifyToken, verifyAdmin, restoreProduct);
router.post('/:id/add-to-cart', verifyToken, addToCart);

router.post('/product/:productId/createReview', verifyToken, writeReview);

module.exports = router;