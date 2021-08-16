/*-- Import JWT Module --*/
const jwt = require("jsonwebtoken");
const secret = "H@ppyto$Erv3You";

/*-- CONTROLLERS --*/

// create an access token for authenticated user
module.exports.createAccessToken = (authenticatedUser) => {
	
	// extracting 3 properties (id, email, isAdmin)
	const data = {
		id : authenticatedUser._id,
		email : authenticatedUser.email,
		isAdmin : authenticatedUser.isAdmin
	}

	return jwt.sign(data, secret, {});

} // end of createAccessToken

// verifying access token of authenticated user
module.exports.verifyToken = (req, res, next) => {
	let accessToken = req.headers.authorization;
	if(typeof(accessToken) == "undefined"){
		res.status(406).send("Whoops Error! Bearer Token is empty.");
	}else{
		accessToken = accessToken.slice(7);
		jwt.verify(accessToken, secret, (error, verified) => {
			if(error){
				res.status(406).send("Authentication process failed due to Invalid Token.");
			}else{
				req.verifiedUser = verified;
				next();
			}
		});
	}
} // end of verifyToken

// User role verification
module.exports.verifyAdmin = (req, res, next) => {
	if(req.verifiedUser.isAdmin){
		next();
	} else{
		res.status(401).send("Unauthorized Access: Admin access only!");
	}
} // end of verifyAdmin