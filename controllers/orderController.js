const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
/*-- Methods --*/

// Retrieve all orders
module.exports.getAllOrders = (req, res) => {
	Order.find()
	.then( orders => {
		if(orders.length == 0){
			res.status(201).send("There are no orders yet.");
		}else{
			res.status(201).send(orders);
		}
	}).catch( error => {
		res.status(406).send(error);
	});
} //end of getAllOrders


// filter by in-progress, delivery, complete, or cancelled status
module.exports.filterByStatus = (req, res) => {
	if(req.body.status == "in-progress" || req.body.status == "delivery" || req.body.status == "complete" || req.body.status == "cancelled"){
		Order.find({status:req.body.status})
		.then( orders => {
			if(orders.length == 0){
				res.status(201).send(`There are no orders with "${req.body.status}" status as of now.`);
			}else{
				res.status(201).send(orders);
			}
		}).catch( error => {
			res.status(406).send(error);
		});
	}else{
		res.status(406).send("Invalid Query field. Please try again.");
	}
} //end of filterByStatus

// view one order
module.exports.viewOrder = (req, res) => {
	Order.findById(req.params.id)
	.then( order => {
		if(order){
			res.status(201).send(order);
		}else{
			res.status(201).send(`There are no result for ${req.params.id}.`);
		}
	}).catch( error => {
		res.status(406).send(error);
	});
} //end of viewOrder

// Update Order to delivery stage
module.exports.toDeliver = (req, res) => {
	Order.findById(req.params.id)
	.then( order => {
		if(order.status == "complete"){
			res.status(406).send("Unable to proceed. Order is already on complete stage.");
		}else if(order.status == "cancelled"){
			res.status(406).send("Unable to proceed. Order is cancelled.");
		}else if (order.status == "delivery"){
			res.status(406).send("Order is already on delivery stage.");
		}else{
			order.status = "delivery";
			order.save()
			.then( success => {
				res.status(202).send("Order is set for Delivery.");
			}).catch( failed =>{
				res.status(406).send(failed);
			});
		}
	}).catch( error =>{
		res.status(406).send(error);
	});
} //end of toDeliver

// Update Order to Complete
module.exports.toComplete = (req, res) => {
	Order.findById(req.params.id)
	.then( order => {
		if(order.status == "in-progress"){
			res.status(406).send("Unable to proceed. Order is still on in-progress stage.");
		}else if(order.status == "cancelled"){
			res.status(406).send("Unable to proceed. Order is cancelled.");
		}else if (order.status == "complete"){
			res.status(406).send("Unable to proceed. Order is already on complete stage.");
		}else{
			order.status = "complete";
			order.save()
			.then( success => {
				res.status(202).send("Order is complete.");
			}).catch( failed =>{
				res.status(406).send(failed);
			});
		}
	}).catch( error =>{
		res.status(406).send(error);
	});
}

// get orders of the authenticated user.
module.exports.myOrders = (req, res) => {
	Order.find({userId:req.verifiedUser.id})
	.then( orders => {
		if(!orders.length == 0){
			res.status(202).send(orders);
		}else{
			res.status(406).send("You have no orders yet.");
		}
	}).catch( error => {
		res.status(406).send(error);
	});
} //end of myOrders

// get an order of the authenticated user.
module.exports.viewMyOrder = (req, res) => {
	Order.findById(req.params.id)
	.then( order => {
		if(order.userId == req.verifiedUser.id){
			res.status(202).send(order);
		}else{
			res.status(401).send("You are not authorized to proceed to this operation.");
		}
	}).catch( error => {
		res.status(406).send(error);
	});
} //end of viewMyOrder

// Update Order to Complete
module.exports.toCancel = (req, res) => {
	Order.findById(req.params.id)
	.then( order => {
		if(order.userId == req.verifiedUser.id){
			if(order.status == "cancelled"){
				res.status(406).send("Order is already cancelled.");
			}else if(order.status == "complete"){
				res.status(406).send("Order is already complete.");
			}else if(order.status == "delivery"){
				res.status(406).send(`Order is already in delivery stage. Cancelation of ${order._id} is no longer allowed. Please call our Helpdesk for more information.`);
			}else{
				order.status = "cancelled";
				order.save()
				.then( success => {
					res.status(202).send("Order is cancelled.");
				}).catch( failed =>{
					res.status(406).send(failed);
				});
			}
		}else{
			res.status(401).send("You are not authorized to proceed to this operation.");
		}


	}).catch( error =>{
		res.status(406).send(error);
	});
} //end of toCancel