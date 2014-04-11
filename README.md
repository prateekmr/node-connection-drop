node-connection-drop
====================

Node.js websocket connection drop on v0.10.26 seen as load increases

## Problem Description ##
Demonstrates an issue with a Node.js 0.10.26 based server where a large number of websocket disconnects cause a sharp drop in the number
of active connections maintained by the server. The server also becomes unresponsive until the load is reduced and does not accept new connections. 
This is experienced on Windows 8.1 x64 running on Windows Azure.  

Server.js is a plain https node.js based server that runs socket.io without any special configuration. 


## Usage ##

### Installing ###
'npm install'

### Running the test ###

Run server (by default runs oon port 9010):

'node server.js'

'node client.js'