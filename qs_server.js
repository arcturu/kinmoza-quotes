var _ = require('lodash')._,
	quotes = require('./json/quotes.json'),
	scenes = require('./json/scenes.json'),
	persons = require('./json/persons.json'),
	utils = require('./utils'),
	qs = require('./qs');
require('date-utils');

const SEARCH_LOG = './log/search.log';

var bset = [];
var bigrams_quotes = [];
quotes.forEach(function (quote, id) {
	bigrams_quotes[id] = _.uniq(utils.bigramize(quote.text));
	bigrams_quotes[id].forEach(function (b) {
		if (bset[b] === undefined) {
			bset[b] = [];
		}
		bset[b].push(id);
	});
});

var search = function (input) {
	var counts = []; // number of intersections
	var bigrams_input = _.uniq(utils.bigramize(input));
	bigrams_input.forEach(function (bigram_input) {
		if (bset[bigram_input] === undefined) {
			return;
		}
		bset[bigram_input].forEach(function (id) {
			if (counts[id] === undefined) {
				counts[id] = 1;
			} else {
				counts[id]++;
			}
		});
	});

	var dists = [];
	var in_input = [];
	bigrams_input.forEach(function (b) {
		in_input[b] = true;
	});
	counts.forEach(function (count, id) {
		dists.push([id, 1 - count / (bigrams_input.length + bigrams_quotes[id].length - count)]);
	});
	if (dists.length <= 0) {
		return [null, 1];
	}
	return _.min(dists, function (o) {return o[1]});
}

var lookup = function (qobj) {
	return qobj && {
		text: qobj.text,
		person: persons[qobj.person_id].name,
		scene: scenes[qobj.scene_id].name
	};
}

var net = require('net'),
	server = net.createServer(function (socket) {
		var chunk = '';
		socket.setEncoding('utf8');
		socket.on('data', function (data) {
			var input = chunk + data.toString();
			var buff = '';
			for(var i = 0; i < input.length; i++) {
				if (input[i] === '\0') {
					var arr = JSON.parse(buff);
					var res = search(arr[1]);
					var d = new Date();
					res = [lookup(quotes[res[0]]), res[1]];
					socket.write(JSON.stringify([arr[0], res]) + '\0');
					buff = '';
					utils.log(SEARCH_LOG, [buff, res]);
				} else {
					buff += input[i];
				}
			}
			chunk = buff;
		});
	}).listen(qs.port, function () {console.log('--- listening ---');});
