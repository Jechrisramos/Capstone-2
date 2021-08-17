const express = require("express"); 
const mongoose = require("mongoose");

const app = express();
const port = 4000;

/* --Database Connection-- */
	//1st arg = connection string. 2nd arg is an object that will prevents any current/future error while connecting to mongoDB Cloud DB 
	mongoose.connect("mongodb+srv://jramos:123456*@ramos-b121.em0zj.mongodb.net/capstone-2b121?retryWrites=true&w=majority", {
		useNewUrlParser:true,
		useUnifiedTopology:true,
		useFindAndModify:false
	}); 
	let db = mongoose.connection;
	db.on("error", console.error.bind(console, "Connection Error!")); //handles error
	db.once("open", () => console.log("We are connected to our Cloud Database")); //returns message if connecting to db is successful

	/* Import Router Modules */
	const avatarRoutes = require(__dirname + "/routes/avatarRoutes");
	const userRoutes = require(__dirname + "/routes/userRoutes");
	const categoryRoutes = require(__dirname + "/routes/categoryRoutes");
	const productRoutes = require(__dirname + "/routes/productRoutes");
	const orderRoutes = require(__dirname + "/routes/orderRoutes");
	const reviewRoutes = require(__dirname + "/routes/reviewRoutes");
	
	/* --App extended feature-- */
	app.use(express.json());
	app.use(express.urlencoded({extended:true}));

	/* --Routes-- */
	app.use("/avatars", avatarRoutes);
	app.use("/users", userRoutes);
	app.use("/categories", categoryRoutes);
	app.use("/products", productRoutes);
	app.use("/orders", orderRoutes);
	app.use("/reviews", reviewRoutes);

app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));