const express = require("express");
const router = express.Router();

const { verifyToken, verifyAdmin } = require("../auth");

const { myReviews, updateReview, dropReview } = require("../controllers/reviewController");
/* --CONTROLLER-- */

/* --ROUTES-- */
router.get('/', verifyToken, myReviews);
router.put('/review/:reviewId', verifyToken, updateReview);
router.delete('/archive/:reviewId', verifyToken, dropReview);
/*-- Expose/Export router as a module --*/
module.exports = router; 