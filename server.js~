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
        if (message.read && !message.write) {
            //console.log(message.read);
            readPin(message.read, webSocket);
        } else if (message.write) {
            writePin(message, webSocket);
        } else if (message.log) {
            console.log(message.log);
        } else if (message.broadcast) {
            multiSend("Broadcast: " + message);
            //console.log(message.broadcast);
        }
    }

    //Initial function to toggle pin
    function writePin(message, webSocket) {
        var response;
        var timeout = 1000;
        var value;
        var broadcast;
        for (var key in message.write) {
            response = message.write[key].response;
            timeout = message.write[key].trigger;
            value = message.write[key].value;
            broadcast = message.write[key].broadcast;
            pfio.write(value, key);
            setTimeout(function() { pfio.write(0,key);}, timeout);
        }
    }

    function readPin(message, webSocket) {
        for (var i in message) {
            //console.log(i);
            webSocket.send("Read from Pin: " + i);
            
        }
    }
});
