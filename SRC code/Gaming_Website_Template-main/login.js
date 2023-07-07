const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'nodelogin'
});

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// http://localhost:3000/
app.get('/', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/login.html'));
});

// http://localhost:3000/auth
app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/home1');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});
app.get('/register', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/register.html'));
});
app.post('/register', function(request, response){
response.sendFile(path.join(__dirname + '/register.html'))
});
// http://localhost:3000/auth/register
app.post('/auth/register', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
    let email = request.body.email;
	// Ensure the input fields exists and are not empty
	if (username && password && email) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM accounts WHERE username = ?', [username], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				response.send('Username has existed!');
			} else {
				connection.query('INSERT INTO accounts(username, password, email) VALUES(?,?,?)', [username, password, email ], function(error, results) {
                    // If there is an issue with the query, output the error
                    if (error) throw error;
                    // If the account exists
                               
                });
                response.send('Register success!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});
// http://localhost:3000/home1
app.get('/home1', function(request, response) {
	// Render login template

	response.sendFile(path.join(__dirname + '/index.html'));
});
app.post('/home1', function(request, response){
	response.sendFile(path.join(__dirname + '/Gaming_Website_Template-main/index.html.html'))
	});
// http://localhost:3000/home
app.get('/home1', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.sendFile(path.join(__dirname + './index.html'));
		newFunction();

		
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();

	function newFunction() {
		app.post('/home1', function (_request, response) {
			response.sendFile(path.join(__dirname + '/Gaming_Website_Template-main/index.html'));
		});
	}
});
app.listen(3000);