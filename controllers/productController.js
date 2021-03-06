const Product = require("../models/product");
const Category = require("../models/category");
const User = require("../models/user");
const Review = require("../models/review");
/*-- METHODS --*/

// admin retrieves all products despite of availability
module.exports.adminGetAllProducts = (req, res) => {

	Product.find()
	.then( products => {
		if(products.length == 0){
			//res.status(202).send("There are no added Products yet.");
			res.status(202).send(false);
		}else{
			res.status(202).send(products);
		}
	}).catch( error => {
		res.status(406).send(error);
	});

} //end of adminGetAllProducts

module.exports.fetchProducts = (req, res) => {

	Product.find()
	.then( products => {
		res.status(202).send(products);
	}).catch( error => {
		res.status(406).send(error);
	});

} //end of fetchProducts

// Get all active Products category
module.exports.getAllActiveProducts = (req, res) => {
	
	Category.find({isActive:true})
	.then( categories => {
		if(categories.length == 0){
			//res.status(202).send("There are no categories available for now.");
			res.status(202).send(false);
		}else{
			res.status(202).send(categories);
		}
	}).catch( error => {
		res.status(406).send(error);
	});

} //end of getAllActiveProducts

// Get a product 
module.exports.productView = (req, res) => {
	Product.findById(req.params.id)
	.then( productResult =>{
		if(productResult.length == 0){
			//res.status(202).send("Product does not exist.");
			res.status(202).send(false);
		}else{
			res.status(202).send(productResult);
		}
	}).catch( error => {
		//res.status(406).send("Product does not exist.");
		res.status(406).send(false);
	});
} //end of productView

// get products via product category 
// 611a1a603dbbd31574ae5f9d, 611a1a723dbbd31574ae5f9f, 611a1a823dbbd31574ae5fa1, 611a1a983dbbd31574ae5fa3, 611a1bdc3dbbd31574ae5fad
module.exports.categorizedItems = (req, res) => {
	
	Product.find({category:req.params.categoryId, isAvailable:true})
	.then( products => {
		if(products.length == 0){
			//res.status(202).send("There are no available Products for this category yet.");
			res.status(202).send(false);
		}else{
			//if(products.isAvailable){
				res.status(202).send(products);
		//	}else{
		//		res.status(202).send("There are no available products for this category yet.");
		//	}
		}
	})
	.catch(error => {
		res.status(406).send(error);
	});
} //end of categorizedItems

// Create new Product
module.exports.createProduct = (req, res) => {

	Product.findOne({productName:req.body.productName})
	.then( foundProduct => {
		if(foundProduct){ //if product do exist via product name send error message.
			//res.status(202).send("Whoops. Product already exist.");
			res.status(202).send(false);
		}else{ //else, perform creation of new product
			if(req.body.productName && req.body.description && req.body.price){
				
				let newProduct = new Product({
					productName: req.body.productName,
					sku: req.body.sku,
					description: req.body.description,
					price: req.body.price,
					gallery: req.body.gallery,
					shortDescription: req.body.shortDescription,
					category: req.body.category,
					publishedBy: req.verifiedUser.id
				});

				newProduct.save()
				.then( savedProduct => {
					
					//get the category
					Category.findById(savedProduct.category)
					.then( foundCategory => {
						
						let newProduct = {
							productId: savedProduct._id
						}

						foundCategory.products.push(newProduct); //add product to category's products property.
						foundCategory.save() //save the pushed product
						.then( success => {
							//res.status(201).send(`New Product is added.`);
							res.status(201).send(success);
						}).catch( failed => {
							res.status(406).send(failed);
						});
					}).catch( errorCategory => {
						res.status(406).send(errorCategory);
					});
					
				}).catch(error => {
					res.status(406).send(error);
				});

			}else{
				//res.status(406).send("Product Name, Description and Price are required. Please try again.");
				res.status(406).send(false);
			}
		} //end of else for foundProduct
	}).catch( productError => {
		res.status(406).send(productError);
	});
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
		category: req.body.category
	}
	let options = { new:true }

	Product.findById(req.params.id)
	.then( foundProduct => {
		
		foundProduct.productName = req.body.productName;
		foundProduct.sku = req.body.sku;
		foundProduct.description = req.body.description;
		foundProduct.price = req.body.price;
		foundProduct.gallery = req.body.gallery;
		foundProduct.shortDescription = req.body.shortDescription;
		foundProduct.category = req.body.category;
		
		foundProduct.save()
		.then( success => {
			//res.status(201).send(`${success.productName} successfully updated.`);
			res.status(201).send(success);
		}).catch( failed => {
			res.status(406).send(failed);
		});

	}).catch( errorProduct => {
		res.status(406).send(error);
	});

} //end of updateProduct


// Deactivate/Archive a product
module.exports.archiveProduct = (req, res) => {

	Product.findById(req.params.id)
	.then( resultProduct => {
		if(resultProduct.isAvailable == false){
			//res.status(406).send(`"${resultProduct.productName}" was already archived. No changes made.`);
			res.status(406).send(false);
		}else{
			resultProduct.isAvailable = false;
			resultProduct.save()
			.then( archivedProduct => {
				//res.status(202).send(`"${resultProduct.productName}" is now archived.`);
				res.status(202).send(archivedProduct);
			}).catch( errorDeactivation => {
				//res.status(406).send(errorDeactivation);
				res.status(406).send(false);
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
			//res.status(406).send(`"${resultProduct.productName}" is still active. No changes made.`);
			res.status(406).send(false);
		}else{
			resultProduct.isAvailable = true;
			resultProduct.save()
			.then( restoredProduct => {
				//res.status(202).send(`"${resultProduct.productName}" is now active.`);
				res.status(202).send(restoredProduct);
			}).catch( errorDeactivation => {
				//res.status(406).send(errorDeactivation);
				res.status(406).send(false);
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
		if(resultProduct.isAvailable){
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
						//res.status(201).send(`${resultProduct.productName} is added to cart.`);
						res.status(201).send(success);
					}).catch( failed => { 
						res.status(406).send(failed); 
					});
					//console.log(userResult.cart);

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
						//res.status(201).send(`${resultProduct.productName} is added to cart.`);
						res.status(201).send(success);
					}).catch( failed => { 
						res.status(406).send(failed);
					});

					//console.log(userResult.cart);
				}
			
			}).catch( errorUserResult => {
				res.status(406).send(errorUserResult);
			});
		}else{
			//res.status(406).send("Product is not available right now. Please contact our helpdesk for more details.");
			res.status(406).send(false);
		}
		

	}).catch( errorProductResult => {
		res.status(406).send(errorProductResult);
	});
} //end of addToCart