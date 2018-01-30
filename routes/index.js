var mysql = require('./mysql');
var crypto = require('crypto');


exports.index = function(req, res) {
	console.log("EMAIL IN SESSION " + req.session.email);
	res.render("index");		
};

exports.userpage = function(req, res) {
	res.render("userpage");			
};


exports.signin = function(req, res) {
	
	console.log("SIGNING IN IN API");
	var email = req.param("email");	
	var password = req.param("password");
	
	var encryptedPassword =  crypto.createHash('sha512').update(password).digest("hex");
	
	var sqlQuery = "select * from userinfo where email = '" + email + "'and password ='"+ encryptedPassword +"'";	
	
	console.log("query " + sqlQuery);
	mysql.fetchData(function(err, results) {	
		
		if (err) {
			console.log("SOME ERR IN DB");		
			res.send(500, "Some Error in DB");	
		} 
		else {	
			if (results.length > 0) {
				console.log("SUCCESS IN ELSE");	
				req.session.email = email;
				res.status(200);				
				res.render("userpage");
			} else {
				console.log("IN SIGNIN IF " + results.toString());			
				res.send(400, "some server error");
			}
		}
	}, sqlQuery);
};



exports.signup = function(req, res) {	

	var email = req.param("email");	
	console.log("email received is " + email);	
	
	var sqlQuery = "select * from userinfo where email = '" + email + "'";	

	console.log("check query " + sqlQuery);
	mysql.fetchData(function(err, results) {		
			
		if (err) {
			console.log("SOME ERR IN DB");		
			res.send(500, "some DB err");	
		} 
		else {	
			if (results.length > 0) {
				console.log("IN IF " + results.toString());			
				res.send(409, "User Already Exists");
			} 
			else {
				console.log("IN ELSE");
				createUser(req, res);
			}
		}
	}, sqlQuery);
};



function createUser(req, res){
	
	var email = req.param("email");	
	var password = req.param("password");
	var fullName = req.param("fullName");
	var location = req.param("userLocation");
	
	var encryptedPassword =  crypto.createHash('sha512').update(password).digest("hex");
		
	var sqlQuery = "insert into userinfo (email, password, fullName, location) values ('" + email + "','" + encryptedPassword + "','" + fullName + "','" + location + "')";	

	console.log("query " + sqlQuery);
	mysql.fetchData(function(err, results) {	
		
		if (err) {
			console.log("SOME ERR IN DB");		
			res.send(500, "Some Error in DB");	
		} 
		else {	
			if (results.length > 0) {
				console.log("IN CREATEUSER IF " + results.toString());			
				res.send(409, "some server error");
			} else {
				console.log("SUCCESS IN ELSE");	
				res.status(200);
				res.send();
				//res.sendfile("./views/successfulregistration.html");
			}
		}
	}, sqlQuery);
};



exports.getUserInfo = function(req, res) {	

	var email = req.session.email;	
	console.log("email received is " + email);	
	
	var sqlQuery = "select * from userinfo where email = '" + email + "'";	

	console.log("check query " + sqlQuery);
	mysql.fetchData(function(err, results) {		
			
		if (err) {
			console.log("SOME ERR IN DB");		
			res.send(500, "some DB err");	
		} 
		else {	
			if (results.length > 0) {
				console.log("SUCCESS IN ELSE");	
				req.session.email = email;
				res.status(200);				
				res.send(JSON.stringify(results));
			} 
			else {
				console.log("ERR in GETTING USER INFO");
			}
		}
	}, sqlQuery);
};









