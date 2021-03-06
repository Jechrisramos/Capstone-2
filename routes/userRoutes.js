/* --Import Express Module-- */
const express = require("express"); 
//assigned router from express module
const router = express.Router();

const { verifyToken, verifyAdmin } = require("../auth");

/* --CONTROLLER-- */
const { getUsers, register, login, userProfile, updateUser, updateUserRole, myCart, deleteAllCartItems, deleteOneCartItem, checkOut } = require("../controllers/userController");

/* --ROUTES-- */
router.post('/login', login); 
router.post('/register', register);
router.get('/', verifyToken, verifyAdmin, getUsers);
router.put('/:id/set-admin', verifyToken, verifyAdmin, updateUserRole);
router.get('/profile', verifyToken, userProfile);
router.put('/update', verifyToken, updateUser);
router.get('/my-cart', verifyToken, myCart); //user's cart
router.delete('/my-cart/flush', verifyToken, deleteAllCartItems); //delete all cart items
router.delete('/my-cart/delete/:itemId', verifyToken, deleteOneCartItem); //delete one cart items
router.post('/checkout', verifyToken, checkOut); //user-checkout

/*-- Expose/Export router as a module --*/
module.exports = router;