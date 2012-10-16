var http = require("http");
var io = require("socket.io");
var url = require("url");
var fs = require("fs");
var settings = require("./settings");

var ioServer;
var httpServer;
		
var usedNumbers = [];		

function startChatServer(port, requestHandlers){
		httpServer = http.createServer(serverRequestHandler);
		ioServer = io.listen(httpServer);

		httpServer.listen(port);
		ioServer.sockets.on("connection", requestHandlers["connection"]);
}



function serverRequestHandler(request, response){
		var urlPath = url.parse(request.url).pathname;
		var urlParams = url.parse(request.url, true).query;

		if(urlPath.indexOf(".css") !== -1){
				fs.readFile(__dirname + urlPath,
										function(error, data){
												response.writeHead(200);
												response.write(data);
												response.end();
										});
		}

		else if(urlPath === settings.callRoute){
				var message = urlParams.message;
				var numberToSendTo = urlParams.number;
				response.writeHead(200, {'content-type': 'text/xml'});
				response.write('<?xml version="1.0" encoding="UTF-8" ?>');
				response.write("<Response>");
				response.write("<Say>");
				response.write(message);
				response.write("</Say>");
				response.write("</Response>");
				response.end();
		}
									
		else if(urlPath === settings.twilioRoute)		{
				var wordSent = urlParams.Body.toLowerCase();
				wordSent = wordSent.trim();
				var options = {
						hostname: settings.partOfSpeechHostName,
						path: settings.generateWordnikPath(settings.wordnikAPIKey, wordSent)
				};

				var requestToSend = http.request(options, function(requestResponse){
						var wordNikResponse = '';

						requestResponse.on("data", function(data){
								wordNikResponse += data;
						});

						requestResponse.on("end", function(){
								var jsObj = JSON.parse(wordNikResponse);
								if(jsObj == undefined || jsObj.length === 0){
										response.writeHead(200, {'content-type': 'text/xml'});
										response.write('<?xml version="1.0" encoding="UTF-8" ?>');
										response.write("<Response><SMS>Sorry, we couldn't find any information for that word, please try again???</SMS></Response>");
										response.end();
								}
								var allPartsOfSpeech =[];
								


								for(var i = 0; i < jsObj.length; i++)
								{
										var currentObj = jsObj[i];
										var partOfSpeech = currentObj["partOfSpeech"];
										if(partOfSpeech != undefined){
												if(partOfSpeech.indexOf("verb") != -1){
														partOfSpeech = "verb";
														if(wordSent.indexOf("ing") === wordSent.length - 3 && partOfSpeech === "verb"){
																partOfSpeech = "participle";
														}
												}
												allPartsOfSpeech.push(partOfSpeech);
										}
								}

								var objToSend = {};
								objToSend["word"] = urlParams["Body"];
								objToSend["partsOfSpeech"] = allPartsOfSpeech;
								ioServer.sockets.emit('message', objToSend);
								var found = false;
								for(var i = 0; i< usedNumbers.length; i++){
										if(usedNumbers[i] == urlParams.From){
												found = true;
										}
								}
								
								if(!found){
										usedNumbers.push(urlParams.From);
										console.log(urlParams.From);
								}
								response.writeHead(200, {'content-type': 'text/xml'});
								response.write('<?xml version="1.0" encoding="UTF-8" ?>');	
								response.write("<Response><Sms>Successfully sent message</Sms></Response>");
								response.end();
						});
				});
				
				requestToSend.end();
		}

		else
		{
				fs.readFile(__dirname + settings.defaultFile, 
								function(error, data){
										if(error){
												response.writeHead(500, {"content-type": "text/plain"});
												response.write("Error loading index.html, we're bad, sorry");
												response.end();
										}
										else
										{
												response.writeHead(200, {"content-type": "text/html"});
												response.write(data);
												response.end();
										}
								});
				
		}

}

function getPhoneNumbers(){
		return usedNumbers;
}

function resetPhoneNumbers(){
		usedNumbers = [];
}

exports.start = startChatServer;
exports.getNumbers = getPhoneNumbers;
exports.resetNumbers = resetPhoneNumbers;