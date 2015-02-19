var twitter = require('twitter'),
	qs = require('./qs'), // quote search
	utils = require('./utils'),
	keys = require('./json/keys');
require('date-utils');

const TWITTER_LOG       = './log/twitter.log';
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
	stream.on('error', function (e) {
		utils.log(TWITTER_LOG, e);
	});
	stream.on('data', function (data) {
		var user_id = data.user && data.user.screen_name;
		var status_id = data.id_str;
		var input = data.text;
		var is_retweet = data.retweeted_status !== undefined;
		var is_reply = data.in_reply_to_user_id !== null;
		utils.log(TWITTER_LOG, data);
		if (user_id !== MY_ID && !is_retweet && !is_reply) {
			qs.search(input, function (res) {
				if (res[1] < THRESHOLD) {
					var tweet = format(user_id, res[0]);
					bot.post('statuses/update', {
						status: tweet,
						in_reply_to_status_id: status_id
					}, function (e, data) { // result of post
						utils.log(ERROR_LOG, e || data);
					});
				}
			});
		}
	});
});
