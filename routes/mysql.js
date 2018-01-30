var ejs = require('ejs');
var mysql = require('mysql');
var arrayOfPools = [];

function getConnection() {
	var connection = mysql.createConnection({
		host : 'localhost',
		user : 'root',
		password : 'root',
		database : 'travel',	
		port : 3306
	});
	return connection;
}

for (var i = 0; i < 1000; i++) {
	var connection = getConnection();
	arrayOfPools.push(connection);
}

function getConnectionFromPool() {
	var connection = arrayOfPools.pop();
	return connection;
}

function releaseConnectionFromPool(connection) {
	arrayOfPools.push(connection);
}

function fetchData(callback, sqlQuery) {

	var connection = getConnectionFromPool();

	connection.query(sqlQuery, function(err, rows, fields) {

		if (err) {
			console.log("MYSQL.js ERROR : " + err.message);
			callback(err, null);
		} else {
			releaseConnectionFromPool(connection);
			callback(err, rows); // called the function passed as parameter to FETCHDATA function
		}
	});
}

exports.fetchData = fetchData;








