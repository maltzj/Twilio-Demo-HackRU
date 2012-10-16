var addressDeployedOn = "";
var twilioAccountId = "";
var twilioAuthToken = "";
var twilioNumberCallingFrom = "";

var partOfSpeechHostName = "";
var partOfSpeechAPIKey = "";

/*note, this assumes that you are using the wordnik api*/
function generateWordnikRequest(apiKey, word){
		return "//v4/word.json/"+word+"/definitions?includeRelated=false&includeTags=false&useCanonical=true&api_key=" + partOfSpeechAPIKey;
}

var callRoute = "";
var twilioRoute = "";
var defaultFileName = "";
		

exports.twilioAuthToken = twilioAuthToken;
exports.addressDeployedOn = addressDeployedOn;
exports.twilioAccountId = twilioAccountId;
exports.numberCallingFrom = twilioNumberCallingFrom;

exports.generateWordnikPath = generateWordnikRequest;
exports.partOfSpeechHostName = partOfSpeechHostName;
exports.wordnikAPIKey = partOfSpeechAPIKey;

exports.callRoute = callRoute;
exports.twilioRoute = twilioRoute;
exports.defaultFile = defaultFileName;