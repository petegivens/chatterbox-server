var url = require('url');
var qs = require('querystring');
/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var messages = {results: [{username: "Hackerman", text: "I\'m so kool", roomname: "lobby", objectId: 1}]};
var objectId = 2;

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.

  // The outgoing status.
  var statusCode = 200;


  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;
  var endPoint = url.parse(request.url).pathname;
  console.log('Serving request type ' + request.method + ' for url ' + endPoint);

  if (endPoint !== '/classes/messages' && endPoint !== '/classes/room') {
    // console.log('the good one: ', url.parse(request.url).pathname)
    // console.log('url without url module: ', request.url);
    // console.log(qs.parse(url.parse(request.url).query))
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end('404: Not Found');

  } else if (request.method === 'POST') {
    headers['Content-Type'] = 'application/json';
    statusCode = 201;

    request.on('data', function(data) {
      data = qs.parse(data.toString());
      // var rawData = data.toString().split('&')
      // data = {};
      // data[rawData[0].split('=')[0]] = rawData[0].split('=')[1]
      // data[rawData[1].split('=')[0]] = rawData[1].split('=')[1]
      data.objectId = objectId;
      console.log('**************currenct objectId: ', objectId);
      objectId++;
      console.log('incremented objectId: ', objectId);
      messages.results.push(data);
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(data));
    });

  } else if (request.method === 'OPTIONS') {
    headers['Content-Type'] = 'plain/text';
    response.writeHead(statusCode, headers);
    response.end( headers['access-control-allow-methods'] );

  } else {
    headers['Content-Type'] = 'application/json';
    response.writeHead(statusCode, headers);
    console.log("SERVER SIDE MESSAGE THROW: ", JSON.stringify(messages));
    response.end(JSON.stringify(messages));
  }



  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.


  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.


  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

module.exports.requestHandler = requestHandler;
