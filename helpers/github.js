const request = require('request');
const config = require('../config.js');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = new JSDOM('').window;
global.document = document;
var $ = (jQuery = require('jquery')(window));

let options = {
  headers: {
    'User-Agent': 'request',
    Authorization: `token ${config.TOKEN}`
  }
};
let getReposByUsername = (USERNAME, callback) => {
  // parameter is defined in type=owner
  $.ajax({
    url: `https://api.github.com/users/${USERNAME}/repos?type=owner`,
    type: 'GET',
    headers: options.headers,
    success: function(data) {
      callback(data);
    },
    error: function(error) {
      console.log(error);
    }
  });
};

let getPublicRepos = callback => {
  $.ajax({
    url: `https://api.github.com/users/repositories/`,
    type: 'GET',
    headers: options.headers,
    success: function(data) {
      callback(data);
    },
    error: function(error) {
      console.log(error);
    }
  });
};

module.exports.getReposByUsername = getReposByUsername;
module.exports.getPublicRepos = getPublicRepos;
