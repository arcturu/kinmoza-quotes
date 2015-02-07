# kinmoza-quotes

twitter streaming api 経由でツイートを取得して、そのツイートがきんモザの台詞に似ているかを判定し、似ていた場合はコンテキストを含めたリプライを返すボットです。

実行するには json/ ディレクトリを作り、その下に quotes.json, scenes.json, persons.json, keys.json を以下のフォーマットで作成してください。

quotes.json
```js 
[{
	"text": "hogehoge",
	"person_id": 1,
	"scene_id": 3
},
{
	"text": "fuga",
	"person_id": 9,
	"scene_id": 90
}]
```

scenes.json
```js 
{
	"3": "hoge scene",
	"90": "fuga scene"
}
```

persons.json
```js
{
	"1": "hoger",
	"9": "fugar"
}
```

twitter developer なんとかのページで取得するやつ

keys.json
```js
{
	"consumer_key": "***************",
	"consumer_secret": "***************",
	"access_token_key": "***************",
	"access_token_secret": "***************"
}
```
