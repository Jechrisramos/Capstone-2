const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema ({
	category: String,
	categoryDescription: String,
	featuredImage: String,
	isActive: {
		type: Boolean,
		default: true
	},
	products: [
		{
			productId: String,
			addedOn: {
				type: Date,
				default: new Date()
			}
		}
	]
}, { timestamps : true });

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;