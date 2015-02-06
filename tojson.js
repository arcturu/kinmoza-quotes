// parse database texts to json

var fs = require('fs');

// ([\s\S]*(\t[\s\S]*)*\n)* -> [[\1, \2,...],...]
var parse_array = function (text) {
	var lines = text.split('\n');
	var arrays = [];
	lines.forEach(function (line) {
		if (line.length <= 0) {
			return;
		}
		arrays.push(line.split('\t'));
	});
	return arrays;
}

fs.readFile('../text/quotes.txt', 'utf8', function (e, text) {
	var quotes = [];
	parse_array(text).forEach(function (row) {
		quotes.push({
			scene_id: parseInt(row[0]),
			person_id: parseInt(row[1]),
			text: row[2]
		});
	});
	fs.writeFile('./json/quotes.json', JSON.stringify(quotes), console.log);
});

fs.readFile('../text/scenes.txt', 'utf8', function (e, text) {
	var scenes = [];
	parse_array(text).forEach(function (row) {
		scenes[row[0]] = { name: row[1] };
	});
	fs.writeFile('./json/scenes.json', JSON.stringify(scenes), console.log);
});

fs.readFile('../text/persons.txt', 'utf8', function (e, text) {
	var persons = [];
	parse_array(text).forEach(function (row) {
		persons[row[0]] = { name: row[1] };
	});
	fs.writeFile('./json/persons.json', JSON.stringify(persons), console.log);
});
