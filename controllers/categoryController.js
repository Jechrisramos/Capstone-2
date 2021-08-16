const Category = require("../models/category");

/*-- METHODS --*/

// Retrieve all active categories
module.exports.getAll = (req, res) => {
	Category.find({isActive:true})
	.then( activeCategories => {
		res.status(202).send(activeCategories);
	}).catch( error => {
		res.status(406).send(error);
	});
} //end of getAll

// Get a Category details
module.exports.getCategory = (req, res) => {
	Category.findById(req.params.id)
	.then( resultCategory => {
		res.status(202).send(resultCategory);
	}).catch( error => {
		res.status(406).send(error);
	});
} //end of getCategory

// Create new product category
module.exports.createCategory = (req, res) => {
	
	if(req.body.category && req.body.categoryDescription && req.body.featuredImage){
		let newCategory = new Category({
			category: req.body.category,
			categoryDescription: req.body.categoryDescription,
			featuredImage: req.body.featuredImage
		});
		newCategory.save()
		.then( addedCategory =>{
			res.status(201).send(`New Category is added.`);
		}).catch( error => {
			res.status(406).send(error);
		});
	}else{
		res.send(`All fields are required`);
	}

} //end of createCategory

// Update product category
module.exports.updateCategory = (req, res) => {

	let updates = {
		category: req.body.category,
		categoryDescription: req.body.categoryDescription,
		featuredImage: req.body.featured_image
	}
	let options = { new:true }

	Category.findByIdAndUpdate(req.params.id, {$set: updates}, options, (error, updated) =>	(error) ? res.status(406).send(error) : res.status(202).send(`"${updated.category}" is updated at ${updated.updatedAt}.`));

} //end of updateCategory

// Deactivate a Product Category
module.exports.deactivateCategory = (req, res) => {

	Category.findById(req.params.id)
	.then( resultCategory => {
		if(resultCategory.isActive == false){
			res.send(`"${resultCategory.category}" category was already inactive. No changes made.`);
		}else{
			resultCategory.isActive = false;
			resultCategory.save()
			.then( deactivatedCategory => {
				res.status(406).send(`"${resultCategory.category}" category is now inactive.`);
			}).catch( errorDeactivation => {
				res.status(406).send(errorDeactivation);
			})
		}
	}).catch(error => {
		res.status(406).send(error);
	});

} //end of deactivateCategory

// Restore an Inactive Product Category
module.exports.restoreCategory = (req, res) => {

	Category.findById(req.params.id)
	.then( resultCategory => {
		if(resultCategory.isActive == true){
			res.send(`"${resultCategory.category}" category is still active. No changes made.`);
		}else{
			resultCategory.isActive = true;
			resultCategory.save()
			.then( activeCategory => {
				res.status(406).send(`"${resultCategory.category}" category is now active.`);
			}).catch(errorDeactivation => {
				res.status(406).send(errorDeactivation);
			})
		}
	}).catch(error => {
		res.status(406).send(error);
	});
	
} //end of restoreCategory