var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var http = require('http');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function (res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
};



// As you progress, keep thinking about what helper functions you can put here!

// for request-handler:
exports.sendResponse = function (response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, exports.headers);
  response.end(data);
};

exports.collectData = function (request, callback) {
  var data = '';
  request.on('data', function (chunk) {
    data += chunk;
  });
  request.on('end', function () {
    callback(data);
  });
};

exports.makeActionHandler = function (actionMap) {
  return function (request, response) {
    var action = actionMap[request.method];
    if (action) {
      action(request, response);
    } else {
      exports.sendResponse(response, '', 404);
    }
  };
};

exports.getWebsiteHtml = function (url) {
  return http.get({
    host: url,
    path: "/"
  }, (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
        `Status Code: ${statusCode}`);
    }
    if (error) {
      console.error(error.message);
      // consume response data to free up memory
      res.resume();
      return;
    }
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        let encodedName = encodeURI(url);
        fs.writeFile(archive.paths.archivedSites + '/' + encodedName + '.html', rawData, (err) => {
          if (err) { throw err; }
        })
      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}


  // const options = {
  //   hostname: url,
  //   port: 80,
  //   path: '/',
  //   method: 'GET',
  //   headers: exports.headers
  // };

  // return http.request(options, (res) => {
  //   console.log(`STATUS: ${res.statusCode}`);
  //   console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  //   res.setEncoding('utf8');
  //   res.on('data', (chunk) => {
  //     console.log(`BODY: ${chunk}`);
  //   });
  //   res.on('end', () => {
  //     console.log('No more data in response.');
  //     let encodedName = encodeURI(url);
  //     console.log('rawData is', rawData);
  //     fs.writeFile(archive.paths.archivedSites + '/' + encodedName, rawData, (err) => {
  //       if (err) { throw err; }
  //     })
  //     console.log('done downloading')
  //   });
  // })
  //   .on('error', (e) => {
  //     console.error(`Got error: ${e.message}`);
  //   });