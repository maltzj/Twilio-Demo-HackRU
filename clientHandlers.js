var serverFunctions = require("./server");
var queryString = require("querystring");
var https = require("https");
var settings = require("./settings.js"); 


function onClientReceived(client){
		client.on('completed', function(data){
				console.log("into the completed method");
				usedNumbers = serverFunctions.getNumbers();
				var numberSendingFrom = settings.numberCallingFrom;
				var messageToSend = data.message;
				

				var options = {
						host : "api.twilio.com",
						path : "/2010-04-01/Accounts/" + settings.twilioAccountId +"/Calls.json",
						method: "POST"
				};				
				console.log(options.path);

				for(var i = 0; i < usedNumbers.length; i++){
						var numberSendingTo = usedNumbers[i];
				
						var postData ={
								'To': numberSendingTo,
								'From': numberSendingFrom,
								'Url': "http://"+settings.addressDeployedOn+"/callPage?message=" + encodeURIComponent(messageToSend) + "&number="+numberSendingTo.trim()
						};
						console.log(postData.Url);
						console.log(numberSendingTo);
						console.log(numberSendingFrom);

						var stringifiedData = queryString.stringify(postData);
						options.headers= {
										'Content-Type': 'application/x-www-form-urlencoded',
								'Content-Length': stringifiedData.length,
								'Authorization': 'Basic ' + new Buffer(settings.twilioAccountId + ":" + settings.twilioAuthToken).toString('Base64')
						};
						var httpsRequest = https.request(options, function(response){
								var twilioResponse = '';
								response.on("data", function(data){
										twilioResponse += data;
								});

								response.on("end", function(data){
										console.log(twilioResponse);
								});
								
						});
						httpsRequest.write(stringifiedData);
						httpsRequest.end();
				}
				serverFunctions.resetNumbers();
			});
		client.send("Successfully connected");
		client.broadcast.send({announcement: "Client " + client.sessionId + " has successfully connected"});
};


exports.onNewClient = onClientReceived;
