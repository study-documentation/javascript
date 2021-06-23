#!/usr/bin/env node

"use strict";

var util = require("util");
var path = require("path");
var fs = require("fs");

var sqlite3 = require("sqlite3");
// require("console.table");


// ************************************

const DB_PATH = path.join(__dirname,"my.db");
const DB_SQL_PATH = path.join(__dirname,"mydb.sql");

var args = require("minimist")(process.argv.slice(2),{
	string: ["other",],
});

main().catch(console.error);


// ************************************

var SQL3;

async function main() {
	if (!args.other) {
		error("Missing '--other=..'");
		return;
	}

	// define some SQLite3 database helpers
	var myDB = new sqlite3.Database(DB_PATH);
	SQL3 = {
		run(...args) {
			return new Promise(function c(resolve,reject){
				myDB.run(...args,function onResult(err){
					if (err) reject(err);
					else resolve(this);
				});
			});
		},
		get: util.promisify(myDB.get.bind(myDB)), // util.promisify ships with node. 
		all: util.promisify(myDB.all.bind(myDB)),
		exec: util.promisify(myDB.exec.bind(myDB)),
	};

	var initSQL = fs.readFileSync(DB_SQL_PATH,"utf-8");
	// TODO: initialize the DB structure
	await SQL3.exec(initSQL);


	var other = args.other;
	var something = Math.trunc(Math.random() * 1E9);

	// ***********

	// TODO: insert values and print all records

	error("Oops!");
}

function error(err) {
	if (err) {
		console.error(err.toString());
		console.log("");
	}
}


/* NOTES: Make a command line app that takes a parameter and sticks that, along with 
a randomly generate key, into a DB record.

remember __dirname
path.join(__dirname,"<some file name>")


 */
