var net = require('net'),
	socket = net.Socket(),
	utils = require('./utils');

var eventlisteners = [];
var chunk = '';

socket.on('data', function(data) {
	var res = chunk + data.toString();
	var buff = '';
	for (i = 0; i < res.length; i++) {
		if (res[i] === '\0') {
			var arr = JSON.parse(buff);
			eventlisteners[arr[0]](arr[1]);
			eventlisteners.pop(arr[0]);
			buff = '';
		} else {
			buff += res[i];
		}
	}
	chunk = buff;
});

module.exports = {
	port: 7575,
	search: function (input, callback) {
		var id = eventlisteners.push(callback) - 1;
		socket.write(JSON.stringify([id, input]) + '\0');
	},
	connect: function () {
		return socket.connect(this.port);
	}
}
