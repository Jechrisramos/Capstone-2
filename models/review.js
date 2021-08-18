const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema ({
	publishedBy: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		require: true
	},
	productId: {
		type: Schema.Types.ObjectId,
		ref: 'product',
		require: true
	},
	stars: {
		type: Number,
		min: 1,
		max: 5
	},
	comment: String,
	orderId: {
		type: Schema.Types.ObjectId,
		ref: 'order',
		require: true
	},
	isDropped: {
		type: Boolean,
		default: false
	}
}, { timestamps:true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 