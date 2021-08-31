/* --Import Model Module-- */
const Avatar = require("../models/avatar");

/* --Functions-- */

// Retrieve all Avatars
module.exports.getAvatars = (req, res) => {
	Avatar.find({}, (error, result) => (error) ? console.log(error) : res.send(result));
} //end of getAvatars

module.exports.returnOne = (req, res) => {
	Avatar.findById(req.params.id)
	.then(avatar => {
		if(avatar){
			res.status(200).send(avatar)
		}else{
			res.status(406).send(false);
		}
	})
	.catch(error => res.status(406).send(error))
}//end of returnOne

// Create New Avatar(s)
module.exports.createAvatar = (req, res) => {
	req.body.forEach( body => {
		let newAvatar = new Avatar ({
			avatar : body.avatar
		});

		let saved = newAvatar.save((error, savedAvatar) => {
			if(error){ throw error; }
		});
	}); // end of forEach
	res.send("New Avatar(s) created.");
} //end of createAvatar

// Update an Avatar
module.exports.updateAvatar = (req, res) => {
	let updates = { avatar : req.body.avatar };
	let options = { new : true };
	Avatar.findByIdAndUpdate(req.params.id, { $set: updates }, options, (error, updatedAvatar) => (error) ? console.log(error) : res.send(updatedAvatar) );
} //end of updateAvatar

// Delete an Avatar
module.exports.archive = (req, res) => {
	//Avatar.findByIdAndDelete(req.params.id, (error, deletedAvatar) => (error) ? console.log(error) : res.send(deletedAvatar));
	Avatar.findById(req.params.id)
	.then( avatar => {
		if(avatar.isArchived == true){
			res.status(406).send("This avatar was already in archive.");
		}else{
			avatar.isArchived == true;
			avatar.save()
			.then( isArchivedAvatar => {
				res.status(202).send("avatar put to archive.");
			}).catch( errorArchive => {
				res.status(406).send(errorArchive);
			});
		}
	}).catch( error => {
		res.status(406).send(error);
	});
} //end of deleteAvatar