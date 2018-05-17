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
    console.log('sites.txt is', data);
    if (err) {
      console.log('error');
      throw err;
    }
    if (data) {
      let arr = data.split('\n');
      callback(arr.slice(0, arr.length - 1)); //get rid of trailing newLine
    } else {
      callback([]);
    }
  });
};

exports.isUrlInList = function (url, callback) {
  exports.readListOfUrls(function (returnedArray) {
    let result = returnedArray.includes(url);
    callback(result);
  });
};

exports.addUrlToList = function (url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', (err) => {
    if (err) { throw err; }
    else if (callback) { callback(); }
  })
  // exports.readListOfUrls(function (urlArray) {
  //   urlArray.push(url);
  //   fs.writeFile(exports.paths.list, urlArray.join('\n'), (err) => {
  //     if (err) { throw err; }
  //     else if (callback) { callback(); }
  //     console.log('appended!');
  //   });
  // });
};

exports.isUrlArchived = function (url, callback) {
  console.log('isUrlArchived called.')
  //try to read it, if it doesnt work, err.
  let encodedName = encodeURI(url);
  fs.readFile(exports.paths.archivedSites + '/' + encodedName + '.html', 'utf8', (err, data) => {
    if (err) { callback(data) }
    callback(data);
  });
};

exports.downloadUrls = function (urls) {
  for (let url of urls) {
    console.log('url checking is:', url)
    exports.isUrlArchived(url, function (archived) {
      if (!archived) {
        utils.getWebsiteHtml(url);
      }
    });
  }
  //input is an array of new urls
  //for each url in the array
  //download the html of that specific page
  //save it to archives/sites and name it with encodeURI
};