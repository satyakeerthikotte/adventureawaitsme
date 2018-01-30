var mysql = require('./mysql');

exports.groups = function(req, res) {
	res.sendfile("./views/groups.html");		
};


exports.createGroup = function(req, res) {
	
	console.log("CREATING GROUP");
	
	var groupName = req.param("groupName");	
	var groupDescription = req.param("groupDescription");
	var groupAdmin = req.session.email;
	
	var sqlQuery = "insert into groupinfo (groupName, groupDescription, groupAdmin) values ('" + groupName + "','" + groupDescription + "','" + groupAdmin + "')";	
		
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
				res.status(200);
				res.send();
				//res.sendfile("./views/Success.ejs");
			}
		}
	}, sqlQuery);
};


exports.joinGroup = function(req, res) {
	
	console.log("JOIN GROUP");
	
	var groupId = req.param("groupid");			
	var userEmail = req.session.email;	
	
	var sqlQuery = "insert into usergroups (groupid, useremail, status) values ('" + groupId + "','" + userEmail + "', 0)";	
		
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
				res.status(200);
				res.send();
				//res.sendfile("./views/Success.ejs");
			}
		}
	}, sqlQuery);
};



exports.getUserGroups = function(req, res){	
	
	console.log("GETTING USER GROUPS IDS");		
	var userEmail = req.session.email;		
	var sqlQuery = "select * from groupinfo t1, usergroups t2 where t1.groupid = t2.groupid AND t2.useremail = '" + userEmail + "' and status = 0";	
		
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


exports.ApproveGroupUser = function(req, res) {
	
	console.log("APPROVING GROUP USER");
		
	var groupId = req.session.currentgroupid;		
	var userEmail = req.param("userEmail");	
	
	var sqlQuery = "update usergroups SET status = 1 where groupid='" + groupId + "' and useremail='" + userEmail  +"'";		
		
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
				res.status(200);
				res.send();
				//res.sendfile("./views/Success.ejs");
			}
		}
	}, sqlQuery);
};



exports.removeGroupUser = function(req, res) {
	
	console.log("REMOVING GROUP USER");		
	var groupId = req.param("groupId");			
	var userEmail = req.param("userEmail");	
	
	var sqlQuery = "delete from usergroups where groupid = '" + groupId + "' AND useremail = '" + userEmail + "'";	
		
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
				res.status(200);
				res.send();
				//res.sendfile("./views/Success.ejs");
			}
		}
	}, sqlQuery);
};


exports.redirectToGroupPage = function(req, res){
	
	req.session.currentgroupid = req.params.groupid;
	res.sendfile("./views/grouppage.html");
};



exports.getGroupInfo = function(req, res) {
	
	console.log("GET GROUP INFO");
	
	var groupId = req.session.currentgroupid;
	
	var sqlQuery = "select * from groupinfo where groupid = '" + groupId + "'";	
		
	console.log("query " + sqlQuery);
	mysql.fetchData(function(err, results) {	
		
		if (err) {	
			console.log("SOME ERR IN DB");		
			res.send(500, "Some Error in DB");	
		} 	
		else {	
			if (results.length > 0) {
				console.log("IN SIGNIN IF " + results.toString());			
				res.status(200);
				console.log(JSON.stringify(results));
				res.send(JSON.stringify(results));
			} else {					
				console.log("SUCCESS IN ELSE");				
				res.send(400, "some server error");
			}
		}
	}, sqlQuery);
};



exports.getGroupMembers = function(req, res) {
	
	console.log("GET GROUP MEMBERS");	
	var groupId = req.session.currentgroupid;	
	var sqlQuery = "select * from usergroups where groupid = '" + groupId + "' and status = 1";	
		
	console.log("query " + sqlQuery);
	mysql.fetchData(function(err, results) {	
		
		if (err) {	
			console.log("SOME ERR IN DB");		
			res.send(500, "Some Error in DB");	
		} 	
		else {	
			if (results.length > 0) {
				console.log("IN SIGNIN IF " + results.toString());			
				res.status(200);
				console.log(JSON.stringify(results));
				res.send(JSON.stringify(results));
			} else {					
				console.log("SUCCESS IN ELSE");				
				res.send(200, "{}");
			}
		}
	}, sqlQuery);
};



exports.getGroupPendingMembers = function(req, res) {
	
	console.log("GET GROUP PENDING MEMBERS");	
	var groupId = req.session.currentgroupid;	
	var sqlQuery = "select * from usergroups where groupid = '" + groupId + "' and status = 0";		
		
	console.log("query " + sqlQuery);
	mysql.fetchData(function(err, results) {	
		
		if (err) {	
			console.log("SOME ERR IN DB");		
			res.send(500, "Some Error in DB");	
		} 	
		else {	
			if (results.length > 0) {
				console.log("IN SIGNIN IF " + results.toString());			
				res.status(200);
				console.log(JSON.stringify(results));
				res.send(JSON.stringify(results));	
			} else {					
				console.log("SUCCESS IN ELSE");				
				res.send(200, "{}");	
			}	
		}
	}, sqlQuery);
};


exports.searchGroups = function(req, res) {
	
	console.log("SEARCHING GROUPS");	
	
	var searchString = req.param("searchString");	
	
	var sqlQuery = "select * from groupinfo where groupName like '%" + searchString + "%'";		
		
	console.log("query " + sqlQuery);
	mysql.fetchData(function(err, results) {	
		
		if (err) {	
			console.log("SOME ERR IN DB");		
			res.send(500, "Some Error in DB");	
		} 	
		else {	
			if (results.length > 0) {
				console.log("IN SIGNIN IF " + results.toString());			
				res.status(200);
				console.log(JSON.stringify(results));
				res.send(JSON.stringify(results));	
			} else {					
				console.log("SUCCESS IN ELSE");				
				res.send(200, "{}");	
			}	
		}
	}, sqlQuery);
};





exports.createThing = function(req, res) {
	
	console.log("CREATING THING");	
	
	var groupId = req.session.currentgroupid;
	var thing = req.param("thing");
	
	var sqlQuery = "insert into grouptodo (groupid, thing, status) values ('"+ groupId +"','"+ thing +"', 0)"; 		
		
	console.log("query " + sqlQuery);
	mysql.fetchData(function(err, results) {	
		
		if (err) {	
			console.log("SOME ERR IN DB");		
			res.send(500, "Some Error in DB");	
		} 	
		else {	
			if (results.length > 0) {
				console.log("IN SIGNIN IF " + results.toString());			
				res.status(200);
				console.log(JSON.stringify(results));
				res.send(JSON.stringify(results));	
			} else {					
				console.log("SUCCESS IN ELSE");				
				res.send(200, "{}");	
			}	
		}
	}, sqlQuery);
};



exports.getThings = function(req, res) {
	
	console.log("GETTING THINGS");	
	
	var groupId = req.session.currentgroupid;
	
	var sqlQuery = "select * from grouptodo where groupid = '" + groupId + "' and status = 1";		
		
	console.log("query " + sqlQuery);
	mysql.fetchData(function(err, results) {	
		
		if (err) {	
			console.log("SOME ERR IN DB");		
			res.send(500, "Some Error in DB");	
		} 	
		else {	
			if (results.length > 0) {
				console.log("IN SIGNIN IF " + results.toString());			
				res.status(200);
				console.log(JSON.stringify(results));
				res.send(JSON.stringify(results));	
			} else {					
				console.log("SUCCESS IN ELSE");				
				res.send(200, "{}");	
			}	
		}
	}, sqlQuery);
};



exports.getPendingThings = function(req, res) {
	
	console.log("GETTING PENDING THINGS");	
	
	var groupId = req.session.currentgroupid;
	
	var sqlQuery = "select * from grouptodo where groupid = '" + groupId + "' and status = 0";		
		
	console.log("query " + sqlQuery);
	mysql.fetchData(function(err, results) {	
		
		if (err) {	
			console.log("SOME ERR IN DB");		
			res.send(500, "Some Error in DB");	
		} 	
		else {	
			if (results.length > 0) {
				console.log("IN SIGNIN IF " + results.toString());			
				res.status(200);
				console.log(JSON.stringify(results));
				res.send(JSON.stringify(results));	
			} else {					
				console.log("SUCCESS IN ELSE");				
				res.send(200, "{}");	
			}	
		}
	}, sqlQuery);
};



exports.collectThing = function(req, res) {
	
	console.log("COLLECTING THING");	
	
	var groupId = req.session.currentgroupid;
	var thingId = req.param("thingid");
	
	var sqlQuery = "update grouptodo set status=1 where groupid = '" + groupId + "'";		
		
	console.log("query " + sqlQuery);
	mysql.fetchData(function(err, results) {	
		
		if (err) {	
			console.log("SOME ERR IN DB");		
			res.send(500, "Some Error in DB");	
		} 	
		else {	
			if (results.length > 0) {
				console.log("IN SIGNIN IF " + results.toString());			
				res.status(200);
				console.log(JSON.stringify(results));
				res.send(JSON.stringify(results));	
			} else {					
				console.log("SUCCESS IN ELSE");				
				res.send(200, "{}");	
			}	
		}
	}, sqlQuery);
};





