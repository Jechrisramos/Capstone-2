const express = require("express");
const router = express.Router();

const { verifyToken, verifyAdmin } = require("../auth");

/*-- Controllers --*/
const { getAll, getCategory, createCategory, updateCategory, deactivateCategory, restoreCategory } = require("../controllers/categoryController");

router.get('/', verifyToken, verifyAdmin, getAll);
router.get('/category/:id', verifyToken, verifyAdmin, getCategory);
router.post('/create', verifyToken, verifyAdmin, createCategory);
router.put('/:id/update', verifyToken, verifyAdmin, updateCategory);
router.delete('/deactivate/:id', verifyToken, verifyAdmin, deactivateCategory);
router.put('/restore/:id', verifyToken, verifyAdmin, restoreCategory);

module.exports = router;