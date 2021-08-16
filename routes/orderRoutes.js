const express = require("express");
const router = express.Router();

const { verifyToken, verifyAdmin } = require("../auth");

/*-- Controllers --*/
const { getAllOrders, createOrder } = require('../controllers/orderController');
/*-- Routes --*/

router.get('/', verifyToken, verifyAdmin, getAllOrders);
router.post('/create', verifyToken, createOrder);

module.exports = router;