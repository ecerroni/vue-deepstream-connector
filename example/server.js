var Deepstream = require( 'deepstream.io' );
var http = require( 'http' );
var express = require( 'express' );
var deepstream = new Deepstream('./config/config.yml');

var app = express();
var server = http.createServer(app);

app.use(express.static(__dirname + '/'));

deepstream.set( 'httpServer', server );

deepstream.start();
server.listen( 6020, '0.0.0.0' ,function(){
    console.log( 'HTTP server listening on 6020' );
});