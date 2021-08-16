/* --Import Express Module-- */
const express = require("express"); 
//assigned router from express module
const router = express.Router();

const { verifyToken, verifyAdmin } = require("../auth");

/* --CONTROLLER-- */
const { getUsers, register, login, userProfile, updateUser, updateUserRole, checkOut } = require("../controllers/userController");


/* --ROUTES-- */
router.post('/login', login);
router.post('/register', register);
router.get('/', verifyToken, verifyAdmin, getUsers);
router.put('/:id/set-admin', verifyToken, verifyAdmin, updateUserRole);
router.get('/profile', verifyToken, userProfile);
router.put('/update', verifyToken, updateUser);
router.post('/checkout', verifyToken, checkOut); //user-checkout
/*-- Expose/Export router as a module --*/
module.exports = router;