'use strict';

var socketio=require('socket.io'),
    cfg = {
        secure: true,
        port: 9010,
        pfx: require('fs').readFileSync(__dirname+'/cert.pfx')
    },
    connected = 0;

// https server that responds with the number of active websockets
var httpServer = require('https').createServer(cfg, function(req,res){
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({'connected':connected}));
});

// socket.io server bound to the https server
var io = socketio.listen(httpServer);
io.set('transports', ['websocket']);
io.set('log', false); 

io.sockets.on('connection', function(socket) {
    ++connected;
    socket.on('error', function(e){
        --connected;
    });
    socket.on('disconnect', function(r){
        --connected;
    });
});

httpServer.listen(cfg.port, function(){
    console.log('server listening on port',cfg.port);
});
