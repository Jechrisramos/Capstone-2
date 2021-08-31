/* --MODULES-- */
const bcrypt = require("bcrypt"); 

/* --MODEL-- */ 
const User = require("../models/user");
const Order = require("../models/order");
const { createAccessToken } = require("../auth");

/* --CONTROLLERS-- */

// Get all users
module.exports.getUsers = (req, res) => {
	User.find({})
	.then( users => {
		res.status(202).send(users);
	})
	.catch( error => res.status(409).send(error) );
} // end of getUsers

// Register New User
module.exports.register = (req, res) => {
	// res.send(req.body.address.state);
	if(req.body.firstName && req.body.lastName && req.body.avatarId && req.body.tel && req.body.email && req.body.password){
		//converting email inputs into lowercase format
		let formattedEmail = req.body.email.toLowerCase();
		// find email from collection
		User.findOne( {email : formattedEmail} )
		.then( result => {
			if(result){
				res.status(406).send(false);
			}else{
				let newUser = new User({
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					avatarId: "611776a641ce1d3390ba4f6f",
					tel: req.body.tel,
					email: formattedEmail,
					password: bcrypt.hashSync(req.body.password, 10),
					isAdmin: req.body.isAdmin,
					address: req.body.address
				});
				newUser.save()
				//.then( registeredUser => res.status(201).send(`New User is registered.`) )
				.then( registeredUser => res.status(201).send(true) )
				.catch( errorResult => res.status(409).send(errorResult) );
			}
		} )
		.catch( error => res.status(409).send(error) );
	}else{
		//res.status(406).send(`All inputs are required.`);
		res.status(406).send(false);
	}

} // end of register

// login user
module.exports.login = (req, res) => {
	
	if(req.body.email && req.body.password){
		let formattedEmail = req.body.email.toLowerCase();
		User.findOne({email:formattedEmail}, (error, foundUser) => {
			if(error){
				res.status(406).send(error);
			} else {
				if(foundUser && (foundUser.email == formattedEmail)){
					if(bcrypt.compareSync(req.body.password, foundUser.password)){
						 res.status(202).send({ accessToken : createAccessToken(foundUser) });
						//res.status(202).send(true)
					}else{
						res.status(406).send("The password you entered does not match. Please try again.");
						// res.status(406).send(false);
					}
				}else{
					res.status(406).send("Whoops! Email does not exist. Please try again.");
					// res.status(406).send(false);
				}
			}
		});
	} else {
		res.status(406).send("All fields are required.");
		// res.status(406).send(false);
	}

} // end of login

// User profile
module.exports.userProfile = (req, res) => {
	User.findById(req.verifiedUser.id, (error, profile) => {
		if(error){
			res.status(406).send(error);
		}else{
			res.status(202).send(profile);
		}
	});
} // end of profile

// Update user info
module.exports.updateUser = (req, res) => {
	
	let updates = {
		firstName : req.body.firstName,
		lastName : req.body.lastName,
		tel : req.body.tel,
		address : req.body.address
	}
	let options = {
		new : true
	}

	User.findByIdAndUpdate(req.verifiedUser.id, {$set:updates}, options, (error, updatedUser) => {
		if(error){
			res.status(409).send(error);
		}else{
			// res.status(202).send("User details updated successfully.");
			res.status(202).send(true);
		}
	});

} // end of updateUser

// Update user role into admin
module.exports.updateUserRole = (req, res) => {
	
	User.findById(req.params.id)
	.then( result => {
		if(result.isAdmin == true){
			// res.status(406).send(`${result.firstName} ${result.lastName} is already an admin.`);
			res.status(406).send(false);
		}else{
			result.isAdmin = true;
			result.save()
			.then( updatedRole => {
				// res.status(202).send(`${result.firstName} ${result.lastName} is now an Admin.`);
				res.status(202).send(true);
			}).catch( errorUpdate => {
				res.status(400).send(errorUpdate);
			})
		}
	}).catch( error => {
		res.status(406).send(error);
	} );

} // end of updateUserRole

// User can view his/her cart
module.exports.myCart = (req, res) => {
	User.findById(req.verifiedUser.id)
	.then( foundUser => {
		// if(foundUser.cart.length == 0){ //if empty
		// 	 res.status(202).send("Your cart is empty. Please continue shopping. Thank you.");
		// }else{ //send cart's items.
			res.status(202).send(foundUser.cart);
		//}
	}).catch( error => {
		res.status(406).send(error);
	} );
} //end of myCart

// User can delete all items in his/her cart
module.exports.deleteAllCartItems = (req, res) => {
	User.findById(req.verifiedUser.id)
	.then( foundUser => {
		if(foundUser.cart.length == 0){ //if empty
			//res.status(202).send("Your cart is empty. Please continue shopping. Thank you.");
			res.status(406).send(false);
		}else{
			foundUser.cart.splice(0, foundUser.cart.length); //delete all starting with index zero based on the cart's total count
			foundUser.save()
			.then( success => {
				res.status(202).send(`Deleted all items in your Cart.`);
			}).catch( failed => {
				res.status(406).send(failed);
			});
		}
	}).catch( error => {
		res.status(406).send(error);
	});
} //end of deleteAllCartItems

// User can remove an item in his/her cart
module.exports.deleteOneCartItem = (req, res) => {
	User.findById(req.verifiedUser.id)
	.then( foundUser => {
		if(foundUser.cart.length == 0){ //if empty
			//res.status(202).send("Your cart is empty. Please continue shopping. Thank you.");
			res.status(406).send(false);
		}else{
			const itemIndex = foundUser.cart.findIndex( foundItem => new String(foundItem._id).trim() == new String(req.params.itemId).trim());
			if(itemIndex >= 0){ //if index is greater than or equal to 0 perform splice
				foundUser.cart.splice(itemIndex, 1); //removing 1 item based on the index of the requested item.
				foundUser.save() //save the whole document
				.then( success => {
					if(success.cart.length == 0){
						//res.status(202).send("Your cart is empty. Please continue shopping. Thank you.");
						res.status(406).send(false);
					}else{
						res.status(201).send(success.cart); //will send user's updated cart
					}
				}).catch( failed => {
					res.status(406).send(failed);
				});
			}else{ // assume itemIndex = -1 which no result throw error message.
				//res.status(406).send(`${req.params.itemId} has no result. No changes made.`);
				res.status(406).send(false);
			}
			
		}
	}).catch( error => {
		res.status(406).send(error);
	});
} //end of deleteOnceCartItem

// let user proceed to checkout his/her cart items.
module.exports.checkOut = (req, res) => {

	User.findById(req.verifiedUser.id)
	.then( foundUser => {

		//if cart is empty throw prompt message.
		if(foundUser.cart.length == 0){
			// res.status(406).send("Please add product(s) to your cart first, before proceeding to check-out. Thank you.");
			res.status(406).send(false);
		}else{ //proceed to create an order instead
			let computedPrices = 0;
			if(foundUser.cart.length > 1){
				//compute each subtotal price of items.
				computedPrices = foundUser.cart.reduce((initial, current) => {
					return initial.subTotal + current.subTotal;
				});
			}else{
				computedPrices = foundUser.cart[0].subTotal;
			}

			// instantiate new order
			let newOrder = new Order ({
				products: foundUser.cart,
				totalAmount: computedPrices, 
				userId: foundUser._id,
				paymentMethod: "COD",
				status: "in-progress"
			});

			//saving the newOrder to collection with in-progress status.
			newOrder.save()
			.then( addedNewOrder => {

				// saving the order id into user's order property
				foundUser.orders.push(newOrder._id);
				// removing all items in users cart
				foundUser.cart.splice(0, foundUser.cart.length);
				foundUser.save()
				.then( success => {
					// res.status(201).send(`Congratulations! Your Order with serial number ${newOrder._id} was successfully added.`);
					res.status(201).send(success);
				}).catch( failed => {
					res.status(406).send(failed);
				});

			}).catch( failedAddingOrder => { res.send(failedAddingOrder) });
		}
	}).catch( errorUser => {
		res.send(errorUser);
	});

} //end of checkOut
