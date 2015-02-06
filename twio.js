var twitter = require('twitter'),
	fs = require('fs'),
	qs = require('./qs'), // quote search
	utils = require('./utils'),
	keys = require('./json/keys');
require('date-utils');

const ERROR_LOG         = './log/error.log';
const REPLY_LOG         = './log/reply.log';
const MY_ID             = 'kinmoza_quotes';
const TWEET_MAX_LENGTH  = 140;
const THRESHOLD         = 0.7;

// make search result into tweet format
var format = function (id, sobj) {
	var text = sobj.text;
	var rest = TWEET_MAX_LENGTH - (id.length + text.length + sobj.person.length + sobj.scene.length + 7);
	if (rest < 0) {
		text = text.substr(0, text.length + rest - 3) + '...';
	}
	return '@' + id + '\n「' + text + '」（' + sobj.person + '）\n' + sobj.scene;
}

bot = new twitter(keys);
qs.connect();

bot.stream('user', function (stream) {
	stream.on('data', function (data) {
		var user_id = data.user && data.user.screen_name;
		var status_id = data.id_str;
		var input = data.text;
		var is_retweet = data.retweeted_status !== undefined;
		var is_reply = data.in_reply_to_user_id !== null;
		if (user_id !== MY_ID && !is_retweet && !is_reply) {
			qs.search(input, function (res) {
				if (res[1] < THRESHOLD) {
					var tweet = format(user_id, res[0]);
					fs.appendFile(REPLY_LOG, JSON.stringify(obj) + '\n');
					bot.post('statuses/update', {
						status: tweet,
						in_reply_to_status_id: status_id
					}, function (e, data) {
						var obj = {};
						obj.time = (new Date()).toFormat('YYYY/MM/DD/ HH24:MI:SS');
						if (e) {
							obj.error = e;
							fs.appendFile(ERROR_LOG, JSON.stringify(obj) + '\n');
						} else {
							obj.data = data;
							fs.appendFile(REPLY_LOG, JSON.stringify(obj) + '\n');
						}
					});
				}
			});
		}
	});
});
