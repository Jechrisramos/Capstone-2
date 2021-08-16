/* --Import Mongoose module--  */
const mongoose = require("mongoose");
//destructure Schema object from mongoose module
const { Schema } = mongoose;


/* --Schema-- */
//instantiate new schema
const avatarSchema = new Schema ({
	avatar: String,
	isArchived: {
		type: Boolean,
		default: false
	}
},{ 
	timestamps: true //added timestamp field
});

/* --Model-- */
			   //mongoose.model('ModelNameInSingularForm', nameOfSchema)
const Avatar = mongoose.model('Avatar', avatarSchema);

/* --Expose/Export Model as Module-- */
module.exports = Avatar; 