var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var utils = require('../web/http-helpers');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  loading: path.join(__dirname, '../web/public/loading.html'),
  index: path.join(__dirname, '../web/public/index.html'),
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function (pathsObj) {
  _.each(pathsObj, function (path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function (callback) {
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    console.log('data is', data);
    console.log('exports.paths.list is', exports.paths.list);
    if (err) {
      console.log('error');
      throw err;
    }
    if (data) {
      console.log('splitting array');
      callback(data.split('\n'));
    } else {
      console.log('empty array');
      callback([]);
    }
  });
};

exports.isUrlInList = function (url, callback) {
  console.log('looking for url:', url);
  exports.readListOfUrls(function (returnedArray) {
    console.log('returned array is', returnedArray);
    let result = returnedArray.includes(url);
    callback(result);
  });
};

exports.addUrlToList = function (url, callback) {
  exports.readListOfUrls(function (urlArray) {
    urlArray.push(url);
    fs.writeFile(exports.paths.list, urlArray.join('\n'), (err) => {
      if (err) { throw err; } else { callback(); }
      console.log('appended!');
      console.log('final array is', urlArray.join('\n') );
    });
  });
};

exports.isUrlArchived = function (url, callback) {
  //try to read it, if it doesnt work, err.
  // let encodedName = encodeURI(url);
  // fs.readFile(exports.paths.archivedSites + '/' + encodedName, 'utf8', (err, data) => {
  //   if (err) { throw err; }
  //   console.log('archived!');
  //   callback(data);
  // });
};

exports.downloadUrls = function (urls) {

  //input is an array of new urls
  //for each url in the array
  //download the html of that specific page
  //save it to archives/sites and name it with encodeURI
};
