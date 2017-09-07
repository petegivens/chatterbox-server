var url = require('url');
var qs = require('querystring');
var fs = require('fs');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var messages = {results: [{username: "Hackerman", text: "I\'m so kool", roomname: "lobby", objectId: 1}]};
// var messages = TODO restore messages from file;
var objectId = messages.results[messages.results.length-1].objectId;

var requestHandler = function(request, response) {
  var statusCode = 200;
  var cwd = process.cwd();

  var headers = defaultCorsHeaders;
  var endPoint = url.parse(request.url).pathname;
  console.log('Serving request type ' + request.method + ' for url ' + endPoint);

  if (endPoint === '/' && request.method === 'GET') {
    fs.readFile(cwd + '/client/index.html', (err, data) => {
      if (err) {
        throw err;
      }
      headers['Content-Type'] = 'text/html';
      response.writeHead(statusCode, headers);
      response.end(data);
    });
  } else if (request.method === 'GET' && endPoint !== '/classes/messages') {
    console.log('cwd + endPoint', cwd + endPoint);
    fs.readFile(cwd + '/client' + endPoint, (err, data) => {
      if (err) {
        response.writeHead(404, headers);
        response.end('404: NOT FOUND');
      }
      headers['Content-Type'] = 'text';
      if (endPoint.split('.')[1] === 'css') {
        headers['Content-Type'] += '/css';
      }
      response.writeHead(statusCode, headers);
      response.end(data);
    });
  } else if (request.method === 'POST') {
    headers['Content-Type'] = 'application/json';
    statusCode = 201;

    request.on('data', function(data) {
      data = qs.parse(data.toString());
      data.objectId = objectId;
      objectId++;
      messages.results.push(data);

      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(data));
    });

  } else if (request.method === 'OPTIONS') {
    headers['Content-Type'] = 'text/plain';
    response.writeHead(statusCode, headers);
    response.end( headers['access-control-allow-methods'] );

  } else {
    headers['Content-Type'] = 'application/json';
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(messages));
  }

};

module.exports.requestHandler = requestHandler;
