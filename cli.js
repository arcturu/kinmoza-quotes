// simple client for debug
// qs_server.js must be started before running this script.
var qs = require ('./qs');

qs.connect(7575);
qs.search(process.argv[2], function (res) {
	console.log(res);
});
