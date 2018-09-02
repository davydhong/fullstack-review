const express = require('express');
const path = require('path');
const { getReposByUsername, getPublicRepos } = require('../helpers/github');
var bodyParser = require('body-parser');
const { Repo, repoSchema } = require('../database/index');
let port = 1128;

express()
	.use(express.static(__dirname + '/../client/dist'))
	.use(bodyParser.json())
	.post('/repos', function(req, res) {
		console.log('---POST RECEIVED---');
		// This route should take the github username provided

		// and get the repo information from the github API, then
		// save the repo information in the database
		getReposByUsername(req.body.id, repos => {
			// var RepoToUse = repos.slice(0, 25);
			Repo.insertMany(repos, err => {
				if (err) {
					console.error(err);
					Repo.find()
						.sort({ size: -1 })
						.exec((err, data) => {
							res.statusCode = 201;
							res.send(data);
						});
				} else {
					Repo.find()
						.sort({ size: -1 })
						.exec((err, data) => {
							// NOTE: was not able to create an index at schema creation. Had to do it async after model creation.
							repoSchema.index({ html_url: 1, type: -1 }, { unique: true });
							res.statusCode = 201;
							res.send(data);
						});
				}
			});
		});
	})
	.get('/repos', function(req, res) {
		console.log('---GET RECEIVED---');
		// check for DB to see there is an existing 25 data for the given user
		// if the DB responds with 25, send the DB data
		// if the DB responds with less than 25, augment from github
		Repo.find()
			.sort({ size: -1 })
			.exec((err, data) => {
				res.statusCode = 200;
				res.send(data);
			});
	})
	.listen(port, function() {
		console.log(`listening on port ${port}`);
	});
