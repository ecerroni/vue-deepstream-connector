var Deepstream = require( 'deepstream.io' );
var http = require( 'http' );
var express = require( 'express' );
var deepstream = new Deepstream();



var groups = ['test', 'partners', 'anything'];
var users = ['rico', 'mirko']

deepstream.set( 'permissionHandler', {
    isValidUser: function( connectionData, authData, callback ) {
        console.log(JSON.stringify(connectionData,null,3));
        console.log();
        console.log(JSON.stringify(authData,null,3));


        if( users.indexOf(authData.user)>-1 &&
            authData.password === ('test') &&
            groups.indexOf(authData.group)>-1 ) {

            callback( null, authData.user || 'open' , 'User: '+authData.user+' successfully connected!' );

        } else {
            callback( 'invalid credentials' );
        }
    },

    canPerformAction: function( username, message, callback ) {
        callback( null, true );
    },
    onClientDisconnect: function( username ){} // this one is optional
});


var app = express();
var server = http.createServer(app);

app.use(express.static(__dirname + '/'));

app.get('/hello', function ( req, res ) {
    res.send( 'Hello to you too!' );
})

//deepstream.set('host', '172.17.0.2');
deepstream.set( 'urlPath', '/deepstream' );
deepstream.set( 'httpServer', server );

deepstream.start();
server.listen( 6020, '0.0.0.0' ,function(){
    console.log( 'HTTP server listening on 6020' );
});