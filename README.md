node-connection-drop
====================

Node.js websocket connection drop on v0.10.26 seen as load increases

## Problem Description ##
Demonstrates an issue with a Node.js 0.10.26 based server where a high rate of disconnects cause a sharp drop in the number
of active connections maintained by the server. The server also becomes unresponsive until the load is reduced and does not accept new connections. 
This is seen at lease on Windows 8.1 x64 running on Windows Azure but I haven't tried it on other platforms yet.   

Server.js is a plain https node.js based server that runs socket.io without any special configuration. 

## Usage ##

### Installing ###
'npm install'

### Running the test ###

Run server (by default runs oon port 9010):

node server.js

Run client from different machines than the server 

node client.js

## Problem repro ##
Each run of client.js attempts to maintain 2000 websocket connections with the server url specificed. Each connection disconnects after 3 minutes and the client program starts new connections upto the max number to keep a constant load. The load test runs continuously.

* In order to reproduce this problem run client.js on seperate machines. A ramp up traffic pattern seen in production can be simulated by starting a new run after few seconds of the previous one. 

### Observations on server with node 0.8.12 ###

On the machine running server.js I used perfmon to capture the system reported TCPv4\Connections Established and Working Set of node.exe process

Node 0.8 graphs look as expected. The client disconnects do not show up in Connections Established counter because the counter also shows those TCP counters that are in CLOSE_WAIT state and new connections are started quickly.

![node0.8](https://raw.githubusercontent.com/prateekmr/node-connection-drop/master/report/Node0.8_Connections.jpg)

### Observations on server with node 0.10.26 ###
The system behaves well till the same test is repeated with 6000 connections however as the 4th batch is added the server begins to loose connections and becomes unresponsive till all load is not removed.

![node0.10](https://raw.githubusercontent.com/prateekmr/node-connection-drop/master/report/Node0.10_Connections.jpg)

