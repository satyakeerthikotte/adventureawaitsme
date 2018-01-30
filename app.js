var express = require('express')
  , routes = require('./routes')
  , groups = require('./routes/groups')
  , admin = require('./routes/admin')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
var ejs = require("ejs");

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat', duration: 30 * 60 * 1000}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.post('/signup', routes.signup);
app.post('/signin', routes.signin);
app.get('/userpage', routes.userpage);
app.get('/getuserinfo', routes.getUserInfo);

app.get('/groups', groups.groups);
app.post('/creategroup', groups.createGroup);


app.get('/group/:groupid', groups.redirectToGroupPage);
app.get('/groupinfo', groups.getGroupInfo);
app.get('/groupmembers', groups.getGroupMembers);	
app.get('/grouppendingmembers', groups.getGroupPendingMembers);	

app.post('/searchgroups', groups.searchGroups);	
	
app.post('/joingroup', groups.joinGroup);
app.post('/removegroup', admin.removeGroup);
app.get('/getusergroups', groups.getUserGroups);
app.get('/getuserpendinggroups', groups.getUserPendingGroups);
app.post('/removegroupuser', groups.removeGroupUser);
app.get('/gettobeapprovedusers', groups.getToBeApprovedUsers);
app.post('/approvegroupuser', groups.ApproveGroupUser);	

/*app.get('/group/:id', function(req, res) {
	console.log("HE " + req.params.id);
	res.sendfile("./views/index.ejs");
});*/


app.post('/creatething', groups.createThing);
app.post('/collectthing', groups.collectThing);
app.get('/getthings', groups.getThings);
app.get('/getpendingthings', groups.getPendingThings);


//******************************************************
//ADMIN

app.get('/admin', admin.redirectToAdminSignIn);
app.post('/adminsignin', admin.adminSignIn);
app.get('/adminpage', admin.redirectToAdminPage);
app.get('/getallgroups', admin.getAllGroups);
app.get('/getallusers', admin.getAllUsers);

app.get('/getgroupcategorygraphs', admin.getGroupCategoryGraphs);
app.get('/getlocationcategorygraphs', admin.getLocationCategoryGraphs);	

	
app.get('/sports', function(req,res){
	res.status(200);
	res.render("sports");	
});

app.post('/sports', user.getSportsFromDB);

app.get('/insert', user.insertStateNameFromZipCode);
		


app.get('/hiking', function(req,res){res.status(200); res.render("hiking");});
app.get('/mountaineering', function(req,res){res.status(200); res.render("mountaineering");});
app.get('/rafting', function(req,res){res.status(200); res.render("rafting");});
app.get('/rockclimbing', function(req,res){res.status(200); res.render("rockclimbing");});
app.get('/scubadiving', function(req,res){res.status(200); res.render("scubadiving");});
app.get('/skydiving', function(req,res){res.status(200); res.render("skydiving");});
app.get('/surfing', function(req,res){res.status(200); res.render("surfing");});



app.get('/places', function(req,res){
	res.status(200);
	res.render("places");	
});


app.get('/signout', function(req,res){req.session.destroy();
	console.log("Session destroyed");
	res.redirect('/');
});


app.use(function(req, res) {
   res.status(400);   
   res.render("error");	
});

app.use(function(error, req, res, next) {
   res.status(500);   
   res.render("error");
});
	 

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});












