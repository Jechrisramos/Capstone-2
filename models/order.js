const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
	products: [
		{
			productId: {
				type: Schema.Types.ObjectId,
				ref: 'Product',
				require: true
			},
			quantity: {
				type: Number,
				default: 1
			},
			subTotal: Number
		}
	],
	totalAmount: Number,
	userId: /*String, //logged in user*/ {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	paymentMethod: String, //cod, gcash
	status: String, //in-progress, delivery, complete, cancelled
	purchasedOn: {
		type: Date,
		default: new Date()
	}
}, { timestamps:true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 