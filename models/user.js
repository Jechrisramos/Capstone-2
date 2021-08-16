/* --Import Mongoose module-- */
const mongoose = require("mongoose"); 
// destructure schema object from mongoose module
const { Schema } = mongoose;

/* --Schema-- */
const userSchema = new Schema ({
	firstName: String,
	lastName: String, 
	/*avatarId: { 
		type: String,
		default: "6113f634928b5f227cb8975a"
	},*/
	avatarId: String,
	tel: String,
	email: String,
	password: String,
	isAdmin: {
		type: Boolean,
		default: false 
	},
	address: {
		street:String,
		city:String,
		state:String,
		zipCode:Number
	},
	cart: [ //each user has his/her cart.
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
	orders: [
		{
			orderId: String,
			orderedOn: {
				type: Date,
				default: new Date()
			}
		}
	]
}, { timestamps:true });

/* --Model-- */
const User = mongoose.model("User", userSchema);

/* --Expose/Export Model as Module-- */
module.exports = User;