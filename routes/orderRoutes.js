const express = require("express");
const router = express.Router();

const { verifyToken, verifyAdmin } = require("../auth");

/*-- Controllers --*/
const { getAllOrders, filterByStatus, toDeliver, toComplete, myOrders, viewOrder, toCancel } = require('../controllers/orderController');
/*-- Routes --*/

router.get('/', verifyToken, verifyAdmin, getAllOrders);
router.get('/filter', verifyToken, verifyAdmin, filterByStatus); //receives a req.body of either in-progress || delivery || complete || cancelled
router.put('/:id/process', verifyToken, verifyAdmin, toDeliver);
router.put('/:id/complete', verifyToken, verifyAdmin, toComplete);

router.get('/my-orders', verifyToken, myOrders);
router.get('/order/:id', verifyToken, viewOrder);
router.put('/cancel/:id', verifyToken, toCancel); //only the user who placed the order is allowed to cancel his/her order. 

module.exports = router;