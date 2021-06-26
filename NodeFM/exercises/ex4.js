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
		get: util.promisify(myDB.get.bind(myDB)), // util.promisify ships with node. the run(...args) above are necessary for this promisify stuff
		all: util.promisify(myDB.all.bind(myDB)),
		exec: util.promisify(myDB.exec.bind(myDB)),
	};

	var initSQL = fs.readFileSync(DB_SQL_PATH,"utf-8");
	// TODO: initialize the DB structure
	await SQL3.exec(initSQL);


	var other = args.other;
	var something = Math.trunc(Math.random() * 1E9);

	// ***********

	var otherID = await insertOrLookupOther(other);
	if (otherID) {
		let result = await insertSomething(otherID, something);
		if (result) {
			var records = await getAllRecords();
			if (records && records.length > 0) {
				console.table(records);
				return;
			}
		}
	}

	error("Oops!");
}

async function insertOrLookupOther(other){
	var result = await SQL3.get(
		`
			SELECT
				id
			FROM
				other
			WHERE
				data = ?
		`,
		other
	);

	if (result && result.id) {
		return result.id;
	} else {
		var result = await SQL3.run(
			`
				INSERT INTO
					Other (data)
				VALUES
					(?)
			`,
			other
		);
		if (result && result.lastID) {
			return result.lastID;
		}
	}
}

async function insertSomething(otherID, something){
	var result = await SQL3.run(
		`
			INSERT INTO
				Something (otherID, data)
			VALUES
				(?,?)
		`,
		otherID,
		something
	);
		//.changes is some built in thing-a-ma method
	if(result && result.changes > 0){
		return true;
	}
	return false;
}

async function getAllRecords(){
	var result = await SQL3.all(
		`
			SELECT
				Other.data AS 'other',
				Something.data AS 'something'
			FROM
				Something JOIN Other
				ON (Something.otherID = Other.id)
			ORDER BY
				Other.id DESC, Something.data ASC
		`
	);

	if (result && result.length > 0) {
		return result;
	}
}

function error(err) {
	if (err) {
		console.error(err.toString());
		console.log("");
	}
}


/* 

NOTES: Make a command line app that takes a parameter and sticks that, along with 
a randomly generate key, into a DB record. This example uses SQLite3. This entire exercise is a 
valuable look into asnyc functions. Note that so far in the course async functions have been used 
to handle streams, insert and pull from a database and will be used to create a web server. The point is
that anytime a program depends upon a source outside itself for information the functions interacting
with that data should be async/await. 

OTHER = the varchar data the is being held in the DB
SOMETHING = Primary key

remember __dirname as a useful built in.
path.join(__dirname,"<some file name>")

STRUCTURE

Note that lines....
1-12 are imports
15-22 are environment variables and the program entry point i.e. main() --> tres jav tres noice
27-74 - define the main() function and the procedure of the program
76-149 - define the various functions which are called throughout the main() function

-----------------------------------

Lines 36 - 49 are provided and not well explained in the course. 'run()' appears to be a functional
interface in much the same form as functional databases in Java. SQL3 is an object that holds
another run function and a reference to the database environment variables. get, all, exec are properties
of the SQL3 object. Note the difference from Java here. In Java this DB object would be its own class
file. But other than the different file structure it makes perfect sense that this object exists, a database
is a thing that needs represented. Its not just a series of functions. Databases have properties therefore
must be represented as objects programtically.

This particular database is executed as a file as can be seen on lines 47-9ish

Note the simple logic spread throughout the helper functions. things like 'if(result && result.id){}'. This
is the kind of logic seen in APIs. Simple confirmation of certain pieces of data and contents thereof 
along with true or false returns.

Its also worth noting how these functions are nested in lines 60-70. If some piece of data exists, perform
a task. If that task returns something meaningful perform another. Again, this is the simple kind of logic
common the real work.

 */
