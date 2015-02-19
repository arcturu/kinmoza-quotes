var fs = require('fs');
module.exports = {
	bigramize: function (str) {
		var bigrams = [];
		for (i = 0; i < str.length - 1; i++) {
			bigrams.push(str.substr(i, 2));
		}
		return bigrams;
	},
	// return diff between two process.hrtime() objects
	diffhrt: function (t2, t1) {
		return t2[0] - t1[0] + (t2[1] - t1[1]) / (1000*1000*1000);
	},
	log: function (file_name, data) {
		fs.appendFile(file_name, JSON.stringify({
			'time': (new Date()).toFormat('YYYY/MM/DD HH24:MI:SS'),
			'data': data
		}) + '\n');
	}
}
