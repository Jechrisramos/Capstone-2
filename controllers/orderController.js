const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
/*-- Methods --*/

// Retrieve all orders of the user
module.exports.getAllOrders = (req, res) => {
	Order.find({})
	.select("productId quantity totalAmount userId")
	.populate('productId', 'productName price') 
	.populate('userId', 'firstName lastName')
	.exec()
	.then( orders => {
		res.status(201).send(orders);
	}).catch( error => {
		res.status(406).send(error);
	});
} //end of getAllOrders

// Create a new Order
module.exports.createOrder = (req, res, next) => {

	/*req.body.products.forEach( product => {
		let qty = product.quantity;

		Product.findById(product.productId, (error, resultProduct) => {
			if(error){
				console.log(error);
			}else{
				let subTotal = resultProduct.price*qty;
				product.actualPrice = resultProduct.price;
				product.subTotal = resultProduct.price*qty;
				console.log(product);
			}
		}); //end of findById
	}); //end of forEach*/

	/*let newOrder = new Order({
			products: req.body.products,
			totalAmount: product.subTotal,
			userId: req.verifiedUser.id,
			paymentMethod: req.body.paymentMethod,
			status: "in-progress"
	});

	console.log(newOrder);*/

	/*// good for one item on order
	Product.findById(req.body.productId)
	.then( productResult => {
		
		if(!productResult){
			res.status(406).send("Product not found.");
		}else{
			
			let newOrder = new Order({
				productId: req.body.productId,
				quantity: req.body.quantity,
				totalAmount: productResult.price*req.body.quantity,
				userId: req.verifiedUser.id,
				paymentMethod: req.body.paymentMethod,
				status: "in-progress"
			});

			newOrder.save()
			.then( savedOrder => {
				// --saving the new order to user's orders property at the same time
				User.findById(req.verifiedUser.id)
				.then( foundUser => {
					foundUser.orders.push(savedOrder._id);
					foundUser.save()
						.then(success => res.status(201).send("New Order Successfully added."))
						.catch(failed => res.status(406).send(failed));

				}).catch( noUser => {res.status(406).send(noUser)});
			}).catch( errorSave => {
				res.status(406).send(errorSave);
			});
		}
	}).catch(error => {
		res.status(406).send(error);
	});*/


} //end of createOrder



