# kinmoza-quotes

twitter streaming api 経由でツイートを取得して、そのツイートがきんモザの台詞に似ているかを判定し、似ていた場合はコンテキストを含めたリプライを返すボットです。

実行するには json/ ディレクトリを作り、その下に quotes.json, scenes.json, persons.json, keys.json を以下のフォーマットで作成してください。

```js 
// quotes.json
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

```js 
// scenes.json
{
	"3": "hoge scene",
	"90": "fuga scene"
}
```

```js
// persons.json
{
	"1": "hoger",
	"9": "fugar"
}
```

twitter developer なんとかのページで取得するやつ

```js
// keys.json
{
	"consumer_key": "***************",
	"consumer_secret": "***************",
	"access_token_key": "***************",
	"access_token_secret": "***************"
}
```
