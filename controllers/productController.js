const Product = require("../models/product");
const User = require("../models/user");
/*-- METHODS --*/ 

// Get all active Products
module.exports.getAllProducts = (req, res) => {
	
	Product.find({isAvailable:true})
	.then( products => {
		res.status(201).send(products);
	}).catch( error => {
		res.status(406).send(error);
	});

} //end of getAllProducts

// Get a product
module.exports.productView = (req, res) => {
	Product.findById(req.params.id)
	.then( productResult =>{
		res.status(201).send(productResult);
	}).catch( error => {
		res.status(406).send(error);
	});
} //end of productView

// Create new Product
module.exports.createProduct = (req, res) => {

	if(req.body.productName && req.body.description && req.body.price){
		let newProduct = new Product({
			productName: req.body.productName,
			sku: req.body.sku,
			description: req.body.description,
			price: req.body.price,
			gallery: req.body.gallery,
			shortDescription: req.body.shortDescription,
			categories: req.body.categories,
			publishedBy: req.verifiedUser.id
		});
		newProduct.save()
		.then( savedProduct => {
			res.status(201).send(`New Product is added.`);
		}).catch(error => {
			res.status(406).send(error);
		});
	}else{
		res.status(406).send("Product Name, Description and Price are required. Please try again.");
	}

} //end of createProduct

// Update product details
module.exports.updateProduct = (req, res) => {

	let updates = {
		productName: req.body.productName,
		sku: req.body.sku,
		description: req.body.description,
		price: req.body.price,
		gallery: req.body.gallery,
		shortDescription: req.body.shortDescription,
		categories: req.body.categories
	}
	let options = { new:true }

	Product.findByIdAndUpdate(req.params.id, {$set: updates}, options, (error, updatedProduct) => (error) ? res.status(406).send(error) : res.status(202).send(`"${updatedProduct.productName}" is updated at ${updatedProduct.updatedAt}.`));

} //end of updateProduct


// Deactivate/Archive a product
module.exports.archiveProduct = (req, res) => {

	Product.findById(req.params.id)
	.then( resultProduct => {
		if(resultProduct.isAvailable == false){
			res.status(406).send(`"${resultProduct.productName}" was already archived. No changes made.`);
		}else{
			resultProduct.isAvailable = false;
			resultProduct.save()
			.then( archivedProduct => {
				res.status(202).send(`"${resultProduct.productName}" is now archived.`);
			}).catch( errorDeactivation => {
				res.status(406).send(errorDeactivated);
			});
		}
	}).catch( error => {
		res.status(406).send(error);
	});

} //end of archiveProduct

// Restore a product
module.exports.restoreProduct = (req, res) => {

	Product.findById(req.params.id)
	.then( resultProduct => {
		if(resultProduct.isAvailable == true){
			res.status(406).send(`"${resultProduct.productName}" is still active. No changes made.`);
		}else{
			resultProduct.isAvailable = true;
			resultProduct.save()
			.then( restoredProduct => {
				res.status(202).send(`"${resultProduct.productName}" is now active.`);
			}).catch( errorDeactivation => {
				res.status(406).send(errorDeactivated);
			});
		}
	}).catch( error => {
		res.status(406).send(error);
	});

} //end of restoreProduct

//addToCart 
// 1. let user add a product to his/her cart
// 2. upon adding. on the addToCart Controller get product price and get subtotal of the product (price*req.body.quantity).
// 3. but first, check if the product exists, if yes. append quantity and price to subTotal. else, add as new entry.

// User adds product to his/her Cart.
module.exports.addToCart = (req, res) => {
	//console.log(req.verifiedUser);
	Product.findById(req.params.id)
	.then( resultProduct => {
		
		// get logged in user to access his/her cart
		User.findById(req.verifiedUser.id)
		.then( userResult => {
			
			if(userResult.cart.length == 0){

				let addedToCart = {
					productId: resultProduct._id,
					quantity: 1,
					subTotal: resultProduct.price*1
				}
				userResult.cart.push(addedToCart);

				userResult.save()
				.then( success => {
					res.status(201).send(`${resultProduct.productName} is added to cart.`);
				}).catch( failed => { 
					res.status(406).send(failed); 
				});
				console.log(userResult.cart);

			}else{

				const isExisting = userResult.cart.findIndex( productsIndex => new String(productsIndex.productId).trim() == new String(req.params.id).trim());
				//console.log(isExisting);
				if( isExisting >= 0){
					const cartItem = userResult.cart[isExisting];
					cartItem.quantity += 1;
					cartItem.subTotal = resultProduct.price*cartItem.quantity;
				}else{ //else add as new product in cart.
						
					let newItem = {
						productId: resultProduct._id,
						quantity: 1,
						subTotal: resultProduct.price*1
					}
					userResult.cart.push(newItem);
					
				}

				//then save user
				userResult.save()
				.then( success => {
					res.status(201).send(`${resultProduct.productName} is added to cart.`);
				}).catch( failed => { 
					res.status(406).send(failed);
				});

				console.log(userResult.cart);
			}
	
		}).catch( errorUserResult => {
			res.status(406).send(errorUserResult);
		});

	}).catch( errorProductResult => {
		res.status(406).send(errorProductResult);
	});
} //end of addToCart