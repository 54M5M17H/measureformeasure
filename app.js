var express = require('express');
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var session = require("express-session");
require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.URI, {
	useMongoClient: true
});

app.use("/public", express.static(__dirname + "/public"));
app.use("/lib", express.static(__dirname + "/lib"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// app.use(function(req, res, next){
// 	if(!req.session.auth){
// 		if(req.path == "/measure") res.redirect("/login");
// 		else next();
// 	} else {
// 		if(req.path == "/login") res.redirect("/measure");
// 		else next();
// 	}
// });

app.get("/", function(req, res){
	res.redirect("/measure");
})

app.route("/login")
	.get(function(req, res){
		res.sendFile(__dirname + "/public/login.html");
	})
	.put(function(req, res){
		if(req.body.username == process.env.USERNAME && req.body.password == process.env.PASSWORD){
			req.session.auth = true;
			res.json({status: 200});
		} else {
			res.json({status: 400});
		}

	})

app.get("/measure", function(req, res){
	res.sendFile(__dirname + "/public/measureformeasure.html");
});

var addItem = require("./models/addItem.js");
var updateItem = require("./models/updateItem.js");
var deleteItem = require("./models/deleteItem.js");
var getItems = require("./models/getItems.js");

app.route("/api")
	.put(addItem)
	.post(updateItem)
	.delete(deleteItem)
	.get(getItems)

var server = app.listen(process.env.PORT || 3000);

// TODO: password protect
