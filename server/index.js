const express = require('express');
const path = require('path');
const { getReposByUsername, getPublicRepos } = require('../helpers/github');
var bodyParser = require('body-parser');
const { Repo, repoSchema } = require('../database/index');

let port = 1128;

express()
	.use(express.static(__dirname + '/../client/dist'))
	.use(bodyParser.json())
	.get('/repos', function(req, res) {
		// console.log('---GET RECEIVED---');
		let statusCode = 200;
		getReposSaved(res, statusCode);
	})
	.post('/repos', function(req, res) {
		console.log('---POST RECEIVED---');
		// This route takes the github username provided
		// and get the repo information from the github API, then
		// save the repo information in the database

		// getReposByUsername is an ajax call to the Github API
		getReposByUsername(req.body.id, repos => {
			// Repo is a mongoose model object.
			Repo.insertMany(repos, err => {
				if (err) {
					console.error(err);
					let statusCode = 201;
					getReposSaved(res, statusCode);
				} else {
					let statusCode = 201;
					repoSchema.index({ html_url: 1, type: -1 }, { unique: true });
					getReposSaved(res, statusCode, err => {
						console.error('this ran');
					});
				}
			});
		});
	})
	.listen(port, function() {
		console.log(`listening on port ${port}`);
	});

var getReposSaved = function(res, statusCode, callback) {
	Repo.find()
		.sort({ updated_at: -1 })
		.exec((err, data) => {
			if (!err && !!callback) {
				callback(err, data);
			}
			res.statusCode = statusCode;
			res.send(data);
		});
};
