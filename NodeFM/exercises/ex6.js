#!/usr/bin/env node

"use strict";

var util = require("util");
var path = require("path");
var http = require("http");

var express = require("express");
var sqlite3 = require("sqlite3");

var app = express();

// ************************************

const DB_PATH = path.join(__dirname,"my.db");
const WEB_PATH = path.join(__dirname,"web");
const HTTP_PORT = 8039;

var delay = util.promisify(setTimeout);

// define some SQLite3 database helpers
var myDB = new sqlite3.Database(DB_PATH);
var SQL3 = {
	run(...args) {
		return new Promise(function c(resolve,reject){
			myDB.run(...args,function onResult(err){
				if (err) reject(err);
				else resolve(this);
			});
		});
	},
	get: util.promisify(myDB.get.bind(myDB)),
	all: util.promisify(myDB.all.bind(myDB)),
	exec: util.promisify(myDB.exec.bind(myDB)),
};

var httpserv = http.createServer(app); // note we are passing app here. app is what we called express. This replaces handle request in the last exercise 


main();


// ************************************

function main() {
	defineRoutes();
	httpserv.listen(HTTP_PORT);
	console.log(`Listening on http://localhost:${HTTP_PORT}...`);
}

function defineRoutes() {
	app.get("/get-records", async function(req, res){
		var records = await getAllRecords();
		res.writeHead(200,{
			"Content-Type": "application/json",
			"Cache-Control": "no-cache"
		});
		res.end(JSON.stringify(records));
	});

	app.use(function(req,res,next){
		if (/^\/(?:index\/?)?(?:[?#].*$)?$/.test(req.url)) {
			req.url = "/index.html";
		}
		else if (/^\/js\/.+$/.test(req.url)) {
			next();
			return;
		}
		else if (/^\/(?:[\w\d]+)(?:[\/?#].*$)?$/.test(req.url)) {
			let [,basename] = req.url.match(/^\/([\w\d]+)(?:[\/?#].*$)?$/);
			req.url = `${basename}.html`;
		}

		next();
	});

	app.use(express.static(WEB_PATH, {
		maxAge: 100,
		setHeaders(res){
			res.setHeader("Server","Node Workshop: ex6");
		}
	}))
}

async function getAllRecords() {
	var result = await SQL3.all(
		`
		SELECT
			Something.data AS "something",
			Other.data AS "other"
		FROM
			Something
			JOIN Other ON (Something.otherID = Other.id)
		ORDER BY
			Other.id DESC, Something.data
		`
	);

	return result;
}


/*

NOTES:

A middleware is a function that gets called if an incoming request matches some criteria.

defining routes as above is the same as defining routes in a SPA. specific first followed by the general. 
like if statements etc.

Note that in 100 lines of code, an API is built and data is pulled from SQLite DB. The DB code is no different than
in ex4. Again the patterns are the same. reqs are from the client to the server. res are from the serve to the client.
servers receive requests and send responses. Clients send requests and receive responses. so the res req language is 
from the perspective of the server. Therefore, responses are things like headers and JSON and requests are things like
GET, POST, PUT, DELETE etc as they are requesting that the server execute some action.

app.use is used to mount specific middleware functions at the path which is being specified. app.use can 
be used to parse URLs, etc
*/