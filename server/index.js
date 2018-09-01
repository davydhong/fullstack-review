const express = require('express');
const path = require('path');
const { getReposByUsername, getPublicRepos } = require('../helpers/github');
var bodyParser = require('body-parser');
const { save, Repo } = require('../database/index');

let app = express();

app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.json());

app.post('/repos', function(req, res) {
	console.log('---POST RECEIVED---');
	// This route should take the github username provided

	// and get the repo information from the github API, then
	// save the repo information in the database
	getReposByUsername(req.body.id, repos => {
		var RepoToUse = repos.slice(0, 25);
		Repo.insertMany(RepoToUse, err => {
			if (err) {
				console.error(err);
			} else {
				console.log('Mongoose Working!');
			}
		});
		res.statusCode = 201;
		res.send(RepoToUse);
	});
});

app.get('/repos', function(req, res) {
	console.log('---GET RECEIVED---');
	// check for DB to see there is an existing 25 data for the given user
	// if the DB responds with 25, send the DB data
	// if the DB responds with less than 25, augment from github
	Repo.find({})
		.sort({ size: -1 })
		.limit(25)
		.exec((err, data) => {
			if (err) {
				console.error(err);
			} else if (data.length < 25) {
				// need to make an ajax call to GithubAPI
				getPublicRepos((err, data) => {
					if (err) {
						console.error(err);
					} else {
						res.statusCode = 200;
						res.send(data.slice(0, 25));
					}
				});
			} else {
				console.log(data);
				res.statusCode = 200;
				res.send(data);
			}
		});
});

let port = 1128;

app.listen(port, function() {
	console.log(`listening on port ${port}`);
});
