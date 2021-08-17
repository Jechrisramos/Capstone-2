const Review = require("../models/review");
const Product = require("../models/product");
const Order = require("../models/order");

/*-- CONTROLLER --*/

module.exports.writeReview = (req, res) => {
	Order.findById(req.body.orderNo)
	.then( orderResult => {
		if(orderResult.status == "in-progress"){
			res.status(406).send(`Unable to proceed. "${req.body.orderNo}" is still in ${orderResult.status} status.`);
		}else if(orderResult.status == "delivery"){
			res.status(406).send(`Unable to proceed. "${req.body.orderNo}" is still in ${orderResult.status} status.`);
		}else if(orderResult.status == "cancelled"){
			res.status(406).send(`Unable to proceed. "${req.body.orderNo}" was ${orderResult.status}.`);
		}else{
			Product.findById(req.params.productId)
			.then( productResult => {

				let newReview = new Review ({
					publishedBy: req.verifiedUser.id, //authenticated user
					productId: req.params.productId,
					stars: req.body.stars, // 5
					comment: req.body.comment, //it was a good kit.
					orderId: req.body.orderNo
				});

				newReview.save()
				.then( reviewAdded => {
					productResult.reviews.push(reviewAdded._id);
					productResult.save()
					.then( success => {
						if(reviewAdded.stars >= 3)
							res.status(201).send("Yes! Your review was successfully added.");
						else{
							res.status(201).send("Your review was successfully added.");
						}
					}).catch( failed => {
						res.status(406).send(failed);
					});
				}).catch( errorReview => {
					res.status(406).send(errorReview);
				});

			}).catch( errorProduct => {
				res.status(406).send(errorProduct);
			});
		}
		

	}).catch( errorOrder => {
		res.status(406).send(`Oh no. Order Number ${req.body.orderNo} does not exist. Please try again.`);
	});
}