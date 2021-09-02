const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");
/*-- Methods --*/

// Retrieve all orders
module.exports.getAllOrders = (req, res) => {
	Order.find()
	.then( orders => {
		if(orders.length == 0){
			//res.status(201).send("There are no orders yet.");
			res.status(406).send(false);
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
				//res.status(201).send(`There are no orders with "${req.body.status}" status as of now.`);
				res.status(406).send(false);
			}else{
				res.status(201).send(orders);
			}
		}).catch( error => {
			res.status(406).send(error);
		});
	}else{
		res.status(406).send(false);
	}
} //end of filterByStatus

// view one order
module.exports.viewOrder = (req, res) => {
	Order.findById(req.params.id)
	.then( order => {
		if(order){
			res.status(201).send(order);
		}else{
			//res.status(406).send(`There are no result for ${req.params.id}.`);
			res.status(406).send(false);
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
			//res.status(406).send("Unable to proceed. Order is already on complete stage.");
			res.status(406).send(false);
		}else if(order.status == "cancelled"){
			//res.status(406).send("Unable to proceed. Order is cancelled.");
			res.status(406).send(false);
		}else if (order.status == "delivery"){
			//res.status(406).send("Order is already on delivery stage.");
			res.status(406).send(false);
		}else{
			order.status = "delivery";
			order.save()
			.then( success => {
				res.status(202).send("Order is set for Delivery.");
				res.status(202).send(success);
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
			//res.status(406).send("Unable to proceed. Order is still on in-progress stage.");
			res.status(406).send(false);
		}else if(order.status == "cancelled"){
			//res.status(406).send("Unable to proceed. Order is cancelled.");
			res.status(406).send(false);
		}else if (order.status == "complete"){
			//res.status(406).send("Unable to proceed. Order is already on complete stage.");
			res.status(406).send(false);
		}else{
			order.status = "complete";
			order.save()
			.then( success => {
				//res.status(202).send("Order is complete.");
				res.status(202).send(success);
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
			//res.status(406).send("You have no orders yet.");
			res.status(406).send(false);
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
			//res.status(401).send("You are not authorized to proceed to this operation.");
			res.status(401).send(false);
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
				//res.status(406).send("Order is already cancelled.");
				res.status(406).send(false);
			}else if(order.status == "complete"){
				//res.status(406).send("Order is already complete.");
				res.status(406).send(false);
			}else if(order.status == "delivery"){
				//res.status(406).send(`Order is already in delivery stage. Cancelation of ${order._id} is no longer allowed. Please call our Helpdesk for more information.`);
				res.status(406).send(false);
			}else{
				order.status = "cancelled";
				order.save()
				.then( success => {
					//res.status(202).send("Order is cancelled.");
					res.status(202).send(success);
				}).catch( failed =>{
					res.status(406).send(failed);
				});
			}
		}else{
			//res.status(401).send("You are not authorized to proceed to this operation.");
			res.status(401).send(false);
		}

	}).catch( error =>{
		res.status(406).send(error);
	});
} //end of toCancel