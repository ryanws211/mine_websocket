var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: (process.env.PORT || 5000)});
var webSockets = {}; //userID: webSocket

//Connect /:userID
var userID = 0;
wss.on('connection', function (webSocket) {
    //Get 'userID' from 'path'. Point it to 'webSocket'.
    console.log("Connection received");
    webSockets[userID] = webSocket;
    userID = ++userID;
    
    webSocket.on('message', function(message) {
        //var messageArray = JSON.parse(message);
        console.log(message);
        multiSend(message);
    });

    webSocket.on('close', function() {
        console.log("Connection Closed");
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


});
