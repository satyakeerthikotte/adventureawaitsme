var ejs = require("ejs");
var mongo = require('./mongo');
//var mongoURL = "mongodb://127.0.0.1:27017/sportsDB";
//var mongoURL = "mongodb://Preeti:Preeti@1302@ds119588.mlab.com:19588/sportsdb";

var mongoURL = "mongodb://Preeti:preeti1302@ds119588.mlab.com:19588/sportsdb?authMechanism=SCRAM-SHA-1";


var XHR = require("xmlhttprequest").XMLHttpRequest;
var ObjectID = require('mongodb').ObjectID;

	

exports.getSportsFromDB = function(req, res) {
		
	var json_responses;
	var type = req.param("searchedSport");
	console.log("SEARCHED SPORT " + type);
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		//var coll = mongo.collection('newTestDB');
		var coll = mongo.collection('sportsdb');
		//console.log(coll);
		coll.findOne({}, function(err, user){
			if (user) {
				console.log(user.location);
				//console.log(user.location+" is the latitude");
				json_responses = {"statusCode" : 200 , "data" : user.location};			
				res.send(json_responses);

			} else {
				console.log("returned false");
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
		});
	});
};


exports.getPlacesFromDB = function(req, res) {
	var zipcode = req.param("zipcode");
	var place_name= req.param("place_name");
	var json_responses;

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('newTestDB');

		coll.findOne({type:"hiking"}, function(err, user){
			if (user) {
				// This way subsequent requests will know the user is logged in.
				//req.session.username = user.username;
				console.log(user.latitude +" is the latitude");
				json_responses = {"statusCode" : 200};
				res.send(json_responses);

			} else {
				console.log("returned false");
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
		});
	});
};



//**********************************************************************


exports.insertStateNameFromZipCode = function(req, res) {
		
	var json_responses;
	var finalData = [];
	var apiRequest = new XHR();
	
	console.log("INSERT STATE");
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('sportsdb');
		//console.log(coll);
		coll.findOne({}, function(err, user){
			if (user) {
				console.log(user.location);				
				json_responses = {"statusCode" : 200 , "data" : user.location};			
				
				for (var i in user.location) {
					
					console.log(user.location[i].zipcode);
					
					apiRequest.open("GET","http://ziptasticapi.com/" + user.location[i].zipcode, false);
					apiRequest.send(null);					
					var apiData = JSON.parse(apiRequest.responseText);
					console.log("state " + apiData.state);
					user.location[i].state = apiData.state;
					finalData.push(user.location[i]);
				}
				
				insertInMongo(finalData);
				//console.log("FINAL DATA IS " + JSON.stringify(finalData)); 
				//res.send(json_responses);

			} else {
				console.log("returned false");
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
		});
	});
};



function insertInMongo(finalData) {
	
	var json_responses;
	
	console.log("INSERT IN MONGO");
	
	mongo.connect(mongoURL, function(){
		
		console.log('Connected to mongo at: ' + mongoURL);
		
		var coll = mongo.collection('newsportsdb');

		coll.insert({_id: new ObjectID(), "location":finalData}, function(err, user){
			if (user) {
				
				console.log("INSERTION DONE");				
				json_responses = {"statusCode" : 200 , "data" : user.location};			
				
				//console.log("FINAL DATA IS " + JSON.stringify(finalData)); 
				//res.send(json_responses);

			} else {
				console.log("returned false");
				json_responses = {"statusCode" : 401};
				//res.send(json_responses);
			}
		});
	});
};




























