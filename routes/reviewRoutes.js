const express = require("express");
const router = express.Router();

const { verifyToken, verifyAdmin } = require("../auth");

const { myReviews, updateReview } = require("../controllers/reviewController");
/* --CONTROLLER-- */

/* --ROUTES-- */
router.get('/', verifyToken, myReviews);
router.put('/review/:reviewId', verifyToken, updateReview);

/*-- Expose/Export router as a module --*/
module.exports = router; 