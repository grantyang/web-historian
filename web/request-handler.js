var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var utils = require('./http-helpers');

// require more modules/folders here!

// exports.handleRequest = function (req, res) {
//   res.end(archive.paths.list);
// };

var actions = {
  'GET': function (request, response) {
    fs.readFile(archive.paths.index, 'utf8', function (err, data) {
      if (err) {
        // console.log('error ', err);
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
          console.log('url is already in sites.txt');
          archive.isUrlArchived(inputUrl, function (archivedSite) {
            if (!archivedSite) {
              console.log('site is not yet archived');
              //send user to loading page
              utils.sendResponse(response, '', 404);
            } else {
              //send user to archived page
              console.log('getting archived page');
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
          archive.addUrlToList(inputUrl, function() {
            console.log('call worker');
            //fake function
            //TODO: call worker
          });
        }
      });




      // utils.sendResponse(response, {objectId: message.objectId}, 201);
    });
  },
  'OPTIONS': function (request, response) {
  }
};

exports.handleRequest = utils.makeActionHandler(actions);