var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var utils = require('./http-helpers');

// require more modules/folders here!
var actions = {
  'GET': function (request, response) {
    fs.readFile(archive.paths.index, 'utf8', function (err, data) {
      if (err) {
        utils.sendResponse(response, '', 404);
      } else {
        utils.sendResponse(response, data);
      }
    });
  },
  'POST': function (request, response) {
    utils.collectData(request, function (data) {
      let inputUrl = data.split('=')[1];
      archive.isUrlInList(inputUrl, function (result) {
        if (result) {
          archive.isUrlArchived(inputUrl, function (archivedSite) {
            if (!archivedSite) {
              //send user to loading page
              fs.readFile(archive.paths.loading, 'utf8', function (err, data) {
                if (err) {
                  console.log(err)
                }
                else {
                  utils.sendResponse(response, data, 200);
                }
              })
            } else {
              //send user to archived page
              utils.sendResponse(response, archivedSite);
            }
          });
        } else {
          fs.readFile(archive.paths.loading, 'utf8', function (err, data) {
            if (err) {
              utils.sendResponse(response, '', 404);
            } else {
              utils.sendResponse(response, data, 302);
            }
          });
          archive.addUrlToList(inputUrl);
        }
      });
    });
  },
  'OPTIONS': function (request, response) {
  }
};

exports.handleRequest = utils.makeActionHandler(actions);