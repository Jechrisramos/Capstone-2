const express = require("express");
const router = express.Router();

const { verifyToken, verifyAdmin } = require("../auth");

/* --CONTROLLER-- */

/* --ROUTES-- */
// router.get('/');

/*-- Expose/Export router as a module --*/
module.exports = router;