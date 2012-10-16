var handlers = require("./clientHandlers.js");
var chatServer = require("./server.js");
var serverHandlers = require("./serverHandlers.js");

var requestHandlers = {};
requestHandlers["connection"] = handlers.onNewClient;
requestHandlers["message"] = handlers.onReceived;
requestHandlers["disconnect"] = handlers.onDisconnect;

chatServer.start(8080, requestHandlers);