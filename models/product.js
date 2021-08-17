const mongoose = require("mongoose");
const { Schema } = mongoose; 

const productSchema = new Schema ({
	productName: String,
	sku: String,
	description: String,
	price: {
		type: Number,
		min: 50,
	},
	gallery: [ //will be an array of objects
		{
			image: String
		}
	],
	shortDescription: String,
	category: String,
	isAvailable: {
		type: Boolean,
		default: true
	},
	publishedBy: String,
	reviews: [ //will be an array of objects
		{
			reviewId: String,
			datePublished: {
				type: Date,
				default: new Date()
			}
		}
	]
}, { timestamps:true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;