'use strict';
// for node 0.10 
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

var io = require('socket.io-client'),
    config = {
        host: process.argv[2],
        MaxSockets : parseInt(process.argv[3]) || 1000
    },
    stats = {
        connected: 0,
        pending: config.MaxSockets,
        forcedDisconnects: 0
    },
    disconnectAfter = 180*1000;
    
if(!(config.host && config.MaxSockets)) {
    console.log('usage: node client.js <host> <number of connections>');
    process.exit(1);
}

function connectOne(id) {
    // connect using a different connection every time. reconnects are disabled
    var socket = io.connect(config.host, {
        'force new connection' : true,
        'reconnect': false
    });

    var isConnected = false;
    socket.on('connect', function(){
       isConnected = true;
       ++stats.connected;
       // send some data every 40 secs
       var x  = setInterval(function(){
            socket.emit('ping', function handlePong(data) { });
       },40*1000);

       // self disconnect after some minutes. this simulates a production traffic pattern  
       setTimeout(function(){
           clearInterval(x);
           if(isConnected) {
                ++stats.forcedDisconnects;
                socket.disconnect(); 
           }
           socket = null;
       },disconnectAfter);
    });

    socket.on('error', function(e){
        if(isConnected) {
            isConnected = false;
            --stats.connected;
        }
        ++stats.pending;
    }).on('disconnect', function(r){
        if(isConnected) {
            isConnected = false;
            --stats.connected;
        }
        ++stats.pending;
    });
}

// start 'pending' number of websocket connections every time this function is called
function mainLoop() {
    var toConnect = stats.pending;
    if(toConnect > 0)
    {
        for(var i=0;i<toConnect;i++) {
            --stats.pending;
            connectOne(i);
        }
    }
}

// drive the test loop and report stats periodically
function runMainLoop() {
    setInterval(function(){
        mainLoop();
    }, 100);

    setInterval(function(){
        console.log({
            connected: stats.connected,
            pending: config.MaxSockets - stats.connected,
            total: stats.connected + stats.forcedDisconnects
        });
    }, 30000);
}

runMainLoop();

console.log('test config ', config);
