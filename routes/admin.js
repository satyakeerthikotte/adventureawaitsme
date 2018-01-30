var mysql = require('./mysql');
var mongo = require('./mongo');
var mongoURL = "mongodb://127.0.0.1:27017/sportsDB";
var ejs = require("ejs");


exports.redirectToAdminSignIn = function(req, res) {
	res.render("adminsignin");		
};


exports.redirectToAdminPage = function(req, res) {
	
	if(req.session.admin != null){	
		res.status(200);
		res.render("admin");
	}
	else{
		res.status(400);
		res.send();
	}
};


exports.adminSignIn = function(req, res) {
	
	console.log("ADMIN SIGNIN");			
	var userName = req.param("userName");
	var password = req.param("password");
	
	var sqlQuery = "select * from admin where userName='" + userName + "' and password='" + password + "'";	
		
	console.log("query " + sqlQuery);
	mysql.fetchData(function(err, results) {	
		
		if (err) {
			console.log("SOME ERR IN DB");				
		} 
		else {	
			if (results.length > 0) {
				console.log("admin signed in");
				req.session.admin = "admin";
				res.status(200);
				res.send();
			} 
			else {				
				res.status(400);
				res.send();	
			}
		}
	}, sqlQuery);
};
		

exports.getAllGroups = function(req, res){	
	
	console.log("GETTING ALL GROUPS");			
	var userEmail = req.session.email;		
	var sqlQuery = "select * from groupinfo";	
		
	console.log("query " + sqlQuery);
	mysql.fetchData(function(err, results) {	
		
		if (err) {
			console.log("SOME ERR IN DB");				
		} 
		else {	
			if (results.length > 0) {
				res.status(200);
				res.send(JSON.stringify(results));
			} 
			else {				
				console.log("no groups found");
				return null;
			}
		}
	}, sqlQuery);	
};



exports.getAllUsers= function(req, res){	
	
	console.log("GETTING ALL Users");			
	var userEmail = req.session.email;		
	var sqlQuery = "select * from userinfo";	
		
	console.log("query " + sqlQuery);
	mysql.fetchData(function(err, results) {	
		
		if (err) {
			console.log("SOME ERR IN DB");				
		} 
		else {	
			if (results.length > 0) {
				res.status(200);
				res.send(JSON.stringify(results));
			} 
			else {				
				console.log("no users found");
				return null;
			}
		}
	}, sqlQuery);	
};



exports.getGroupCategoryGraphs = function(req, res) {
	
	console.log("ADMIN GET GROUP Category GRAPHS");			
	
	var sqlQuery = "select DISTINCT groupCategory, COUNT(groupid) as count from groupinfo GROUP BY groupCategory";
		
	console.log("query " + sqlQuery);
	mysql.fetchData(function(err, results) {	
		
		if (err) {
			console.log("SOME ERR IN DB");				
		} 
		else {	
			if (results.length > 0) {
				console.log("send pie " + JSON.stringify(results));
				res.status(200);
				res.send(JSON.stringify(results));
			} 
			else {				
				res.status(400);
				res.send();	
			}
		}
	}, sqlQuery);
};


exports.getLocationCategoryGraphs = function(req, res) {
	
	console.log("ADMIN GET LOCATION Category GRAPHS");			
	
	var sqlQuery = "select DISTINCT groupLocation, COUNT(groupid) as count from groupinfo GROUP BY groupLocation";
		
	console.log("query " + sqlQuery);
	mysql.fetchData(function(err, results) {	
		
		if (err) {
			console.log("SOME ERR IN DB");				
		} 
		else {	
			if (results.length > 0) {
				console.log("send pie " + JSON.stringify(results));
				res.status(200);
				res.send(JSON.stringify(results));
			} 
			else {				
				res.status(400);
				res.send();	
			}
		}
	}, sqlQuery);
};


exports.removeGroup = function(req, res) {
	
	console.log("REMOVING GROUP");
	
	var groupId = req.param("groupid");			
	var userEmail = req.session.email;	
	
	var sqlQuery = "delete FROM groupinfo where groupid = '" + groupId + "'";	
		
	console.log("query " + sqlQuery);
	mysql.fetchData(function(err, results) {	
		
		if (err) {
			console.log("SOME ERR IN DB");		
			res.send(500, "Some Error in DB");	
		} 
		else {	
			if (results.length > 0) {
				console.log("IN SIGNIN IF " + results.toString());			
				res.send(400, "some server error");
			} else {				
				console.log("SUCCESS IN ELSE");	
				removeCascade(groupId);
				/*res.status(200);
				res.send();*/
			}
		}
	}, sqlQuery);
};



function removeCascade(groupId) {
	
	console.log("REMOVING CASCADE");
	
	var sqlQuery = "delete FROM usergroups where groupid = '" + groupId + "'";	
		
	console.log("query " + sqlQuery);
	mysql.fetchData(function(err, results) {	
		
		if (err) {
			console.log("SOME ERR IN DB");		
			//res.send(500, "Some Error in DB");	
		} 
		else {	
			if (results.length > 0) {
				console.log("IN SIGNIN IF " + results.toString());			
				//res.send(400, "some server error");
			} else {				
				console.log("SUCCESS IN ELSE");	
				removeCascade1(groupId);
			}
		}
	}, sqlQuery);
};



function removeCascade1(groupId) {
	
	console.log("REMOVING CASCADE 1");
	
	var sqlQuery = "delete FROM grouptodo where groupid = '" + groupId + "'";	
		
	console.log("query " + sqlQuery);
	mysql.fetchData(function(err, results) {	
		
		if (err) {
			console.log("SOME ERR IN DB");		
			//res.send(500, "Some Error in DB");	
		} 
		else {	
			if (results.length > 0) {
				console.log("IN SIGNIN IF " + results.toString());			
				//res.send(400, "some server error");
			} else {				
				console.log("SUCCESS IN ELSE");	
				
				//res.status(200);
				//res.send();
			}
		}
	}, sqlQuery);
};


















