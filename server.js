var WebSocketServer = require('ws').Server;
var logger = require('caterpillar').createLogger({6:6});
var wss = new WebSocketServer({port: (process.env.PORT || 5000)});
var pif= require('caf_piface');
var pfio = new pif.PiFace();
pfio.init();
pfio.write(1,1);
pfio.write(0,1);
var webSockets = {}; //userID: webSocket

//Setup Logging
logger.pipe(require('fs').createWriteStream('/tmp/server.log'));
logger.log("Logging Started");

//Connect /:userID
var userID = 0;
wss.on('connection', function (webSocket) {
    //Get 'userID' from 'path'. Point it to 'webSocket'.
    console.log("Connection received");
    webSockets[userID] = webSocket;
    userID = ++userID;
    
    webSocket.on('message', function(message) {
        try {
            var json = JSON.parse(message);
            parseMessage(json, webSocket);
            multiSend("JSON: " + message);
        } catch (e) {
            multiSend("Not JSON:" + message);
        }
    });

    webSocket.on('close', function() {
        logger.log("Connection Closed");
    });


    function multiSend(message) {
        for (var sock in webSockets) {
            if (webSockets.hasOwnProperty(sock)) {
                try {
                    webSockets[sock].send(message);
                } catch (e) {
                    delete webSockets[sock];
                }
            }
        }
    }


    function parseMessage(message, webSocket) {
        if (message.read) {
            console.log(message.read);
            readPin(message.read, webSocket);
        } else if (message.write) {
            console.log(message.write['1']);
            writePin(message, webSocket);
        } else if (message.log) {
            console.log(message.log);
        } else if (message.broadcast) {
            multiSend("Broadcast: " + message);
            console.log(message.broadcast);
        }
    }

    //Initial function to toggle pin
    function writePin(message, webSocket) {
        for (var key in message.write) {
            console.log("Write to pin: " + key);
            console.log("Values: " + message.write[key]);
            pfio.write(1, key);
            //process.nextTick(function() { pfio.write(0,key);});
            setTimeout(function() { pfio.write(0,key);}, 1000);
        }
    }

    function readPin(message, webSocket) {
        for (var i in message) {
            console.log(i);
            webSocket.send(i);
            
        }
    }
});
