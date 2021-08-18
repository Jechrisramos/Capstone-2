const Review = require("../models/review");
const Product = require("../models/product");
const Order = require("../models/order"); 

/*-- CONTROLLER --*/

// get user's reviews
module.exports.myReviews = (req, res) => {
	Review.find({publishedBy:req.verifiedUser.id})
	.then( reviews => {
		if(reviews == 0){
			res.status(202).send("You have not published a review yet.");
		}else{
			res.status(202).send(reviews);
		}
	}).catch( error => {
		res.status(406).send(error);
	});
} //end of myReviews

// write a product review - applicable for complete orders
module.exports.writeReview = (req, res) => {
	
	//find order with complete status.
	Order.findById(req.body.orderNo)
	.then( orderResult => {

		if(orderResult.userId == req.verifiedUser.id){
			if(orderResult.status == "in-progress"){
				res.status(406).send(`Unable to proceed. "${req.body.orderNo}" is still in ${orderResult.status} status.`);
			}else if(orderResult.status == "delivery"){
				res.status(406).send(`Unable to proceed. "${req.body.orderNo}" is still in ${orderResult.status} status.`);
			}else if(orderResult.status == "cancelled"){
				res.status(406).send(`Unable to proceed. "${req.body.orderNo}" was ${orderResult.status}.`);
			}else{
				//search for the product via req.parameter
				Product.findById(req.params.productId)
				.then( productResult => {

					//instantiating new review object
					let newReview = new Review ({
						publishedBy: req.verifiedUser.id, //authenticated user
						productId: req.params.productId,
						stars: req.body.stars, // 5
						comment: req.body.comment, //it was a good kit.
						orderId: req.body.orderNo
					});
					//save
					newReview.save()
					.then( reviewAdded => {

						let newReview = {
							reviewId: reviewAdded._id
						}

						productResult.reviews.push(newReview);
						productResult.save()
						.then( success => {
							if(reviewAdded.stars >= 3)
								res.status(201).send("Yes! Your review was successfully added.");
							else{
								res.status(201).send("Your review was successfully added.");
							}
						}).catch( failed => res.status(406).send(failed));
					}).catch( errorReview => {
						res.status(406).send(errorReview);
					});

				}).catch( errorProduct => {
					res.status(406).send(errorProduct);
				});
			}
		}else{
			res.status(401).send("Oh no. Sorry but you are not allowed to proceed to this operation.");
		}
		
		
	//if order is not found send error message.
	}).catch( errorOrder => {
		res.status(406).send(`Oh no. Order Number ${req.body.orderNo} does not exist. Please try again.`);
	});
} //end of writeReview

// update a review entry
module.exports.updateReview = (req, res) => {
	
	Review.findById(req.params.reviewId)
	.then( resultReview => {

		if(resultReview.publishedBy == req.verifiedUser.id){
			if(req.body.stars && req.body.comment){
				resultReview.stars = req.body.stars;
				resultReview.comment = req.body.comment;

				resultReview.save()
				.then( success => {
					res.status(201).send("Review has been updated.");
				}).catch( error => {
					res.status(406).send(error);
				});
			}else{
				res.status(406).send("Rating and Comment are required.");
			}
		}else{
			res.status(401).send("Oh no. Sorry but you are not allowed to proceed to this operation.");
		}
		
		
	}).catch( errorReview => {
		res.status(406).send(errorReview);
	});

} //end of updateReview

// disable or archive a review
module.exports.dropReview = (req, res) => {
	Review.findById(req.params.reviewId)
	.then( resultReview => {

		if(resultReview.publishedBy == req.verifiedUser.id){

			if(resultReview.isDropped) {
				res.status(406).send("Review was already archived.");
			}else{
				resultReview.isDropped = true;

				resultReview.save()
				.then( droppedReview => {
					
					//get the product to find the index of the reviewId from its reviews property
					Product.findById(droppedReview.productId)
					.then( foundProduct => {
						const reviewIndex = foundProduct.reviews.findIndex( foundReview => new String(foundReview.reviewId).trim() == new String(req.params.reviewId).trim());
						if(reviewIndex >= 0){
							
							foundProduct.reviews.splice(reviewIndex, 1);
							
							foundProduct.save()
							.then( success => {
								res.status(202).send("Review is dropped.");
							}).catch( failed => {
								res.status(406).send(failed);
							});

						}else{
							res.status(406).send("Review does not exist.");
						}
					}).catch( errorProduct => {

					});
				}).catch( errorDropping => {
					res.status(406).send(errorDropping);
				});
			}

		}else{
			res.status(401).send("Oh no. Sorry but you are not allowed to proceed to this operation.");
		}
		
	}).catch( errorReview => {
		res.status(406).send(errorReview);
	});
} //end of dropReview