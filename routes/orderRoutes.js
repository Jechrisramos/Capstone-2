const express = require("express");
const router = express.Router();

const { verifyToken, verifyAdmin } = require("../auth");

/*-- Controllers --*/
const { getAllOrders, filterByStatus, viewOrder, toDeliver, toComplete, myOrders, viewMyOrder, toCancel } = require('../controllers/orderController');
/*-- Routes --*/

router.get('/', verifyToken, verifyAdmin, getAllOrders);
router.get('/filter', verifyToken, verifyAdmin, filterByStatus); //receives a req.body of either in-progress || delivery || complete || cancelled
router.get('/:id', verifyToken, verifyAdmin, viewOrder);
router.put('/:id/process', verifyToken, verifyAdmin, toDeliver);
router.put('/complete/:id', verifyToken, verifyAdmin, toComplete);

router.get('/user/my-orders', verifyToken, myOrders);
router.get('/my-orders/order/:id', verifyToken, viewMyOrder);
router.put('/cancel/:id', verifyToken, toCancel); //only the user who placed the order is allowed to cancel his/her order. 

module.exports = router;