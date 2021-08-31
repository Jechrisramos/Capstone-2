/* --Import Express Module-- */
const express = require("express");
//assigned router from express module
const router = express.Router();

const { verifyToken, verifyAdmin } = require("../auth");

/* --Controllers-- */
const { getAvatars, returnOne, createAvatar, updateAvatar, archive } = require("../controllers/avatarController");

/* --Routes-- */
router.get('/', getAvatars);
router.get('/avatar/:id', returnOne);
router.post('/', verifyToken, verifyAdmin, createAvatar);
router.put('/:id/update', verifyToken, verifyAdmin, updateAvatar);
router.delete('/:id/delete', verifyToken, verifyAdmin, archive);

/* --Expose/Export Router as Module-- */
module.exports = router; 