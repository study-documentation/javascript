#!/usr/bin/env node

"use strict";

var util = require("util");
var path = require("path");
var http = require("http");

var sqlite3 = require("sqlite3");
var staticAlias = require("node-static-alias");


// ************************************

const DB_PATH = path.join(__dirname,"my.db");
const WEB_PATH = path.join(__dirname,"web");
const HTTP_PORT = 8039;

var delay = util.promisify(setTimeout);

// define some SQLite3 database helpers
//   (comment out if sqlite3 not working for you)
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

var fileServer = new staticAlias.Server(WEB_PATH,{
	cache: 100,
	serverInfo: "Node Workshop: ex5",
	alias: [
		{
			match: /^\/(?:index\/?)?(?:[?#].*$)?$/,
			serve: "index.html",
			force: true, // force means either perfect match or 404. No flal through to other alias routes
		},
		{
			match: /^\/js\/.+$/, // this says serve as is if it has a javascript extention
			serve: "<% absPath %>",
			force: true,
		},
		{
			match: /^\/(?:[\w\d]+)(?:[\/?#].*$)?$/, // reomves the need for entering .html in the URL which is yucko
			serve: function onMatch(params) {
				return `${params.basename}.html`; // no force which requires the friendly 404 below
			},
		},
		{
			match: /[^]/,
			serve: "404.html",
		},
	],
});
// how a new server is created
var httpserv = http.createServer(handleRequest);

main();


// ************************************

function main() {
	httpserv.listen(HTTP_PORT);
	console.log(`Listening on http://localhost:${HTTP_PORT}...`);
}

async function handleRequest(req, res){
	if (req.url == "/get-records"){
		await delay(1000);
		let records = await getAllRecords();

		res.writeHead(200,{
			"Content-Type": "application/json",
			"Cache-Control": "no-cache"
		});
		res.end(JSON.stringify(records));
	}
	else {
		fileServer.serve(req,res);
	}
}

// *************************
// NOTE: if sqlite3 is not working for you,
//   comment this version out
// *************************
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

// *************************
// NOTE: uncomment and use this version if
//   sqlite3 is not working for you
// *************************
// async function getAllRecords() {
// 	// fake DB results returned
// 	return [
// 		{ something: 53988400, other: "hello" },
// 		{ something: 342383991, other: "hello" },
// 		{ something: 7367746, other: "world" },
// 	];
// }



/*
NOTES:

res and req are streams just like anything else is a stream. the same rules for piping and 
unpiping readables and writables apply. readables can get piped into other streams. pipes return
readables etc. 

Error: cannot find. npm i <such and such> duh

All the fanciness of routing frameworks just boil down to if statements. i.e. 'if(res.url == "/hello")'
or if the request method is a GET or POST or if the URL matches some REGEX, etc.

Body tag = html. Plain text is just plain text.

stringify works well up to a point say 10MB or so. There are packages available for streaming json.
Another option would be to open up a web socket.
*/