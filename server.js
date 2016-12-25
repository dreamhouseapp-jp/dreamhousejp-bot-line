"use strict";

var express = require('express'),
    bodyParser = require('body-parser'),
    processor = require('./modules/processor'),
    handlers = require('./modules/handlers'),
    postbacks = require('./modules/postbacks'),
    uploads = require('./modules/uploads'),
    line = require('./modules/line'),
    app = express();

app.set('port', process.env.PORT || 5000);

app.use(bodyParser.json());

app.get('/webhook', (req, res) => {
  res.send("Get リクエストはサポートしてません");
});

app.post('/webhook', (req, res) => {
    //TODO X-Line-Signatureを検証
    /*
    リクエストの送信元がLINEであることを確認するために署名検証を行わなくてはなりません。
    各リクエストには X-Line-Signature ヘッダが付与されています。
    X-Line-Signature ヘッダの値と、Request Body と Channel Secret から計算した Signature が同じものであることをリクエストごとに 必ず検証してください。

    検証は以下の手順で行います。

    Channel Secretを秘密鍵として、HMAC-SHA256アルゴリズムによりRequest Bodyのダイジェスト値を得る。
    ダイジェスト値をBASE64エンコードした文字列が、Request Headerに付与されたSignatureと一致することを確認する。
    */
    let events = req.body.events;
    for (let i = 0; i < events.length; i++) {
        let event = events[i];
        let source = event.source;
        if (process.env.MAINTENANCE_MODE && ((event.message && event.message.text) || event.replyToken)) {
            line.sendMessage([{type:'text',text: `申し訳ござませんが、現在メンテナンスモード中です。`}], event.replyToken);
        } else if (event.message && event.message.text) {
            console.log(event.message.text);
            let result = processor.match(event.message.text);
            if (result) {
                let handler = handlers[result.handler];
                if (handler && typeof handler === "function") {
                    handler(source,event.replyToken,result.match);
                } else {
                    console.log("Handler " + result.handlerName + " は定義されていません");
                }
            }
        } else if (event.postback) {
            let payload = event.postback.data.split(",");
            let postback = postbacks[payload[0]];
            if (postback && typeof postback === "function") {
                postback(source,event.replyToken, payload);
            } else {
                console.log("Postback " + postback + " は定義されていません");
            }
        } else if (event.message.type == 'image') {
            uploads.processUpload(source,event.replyToken,event.message.id);
        }
    }
    res.sendStatus(200);
});

app.listen(app.get('port'), function () {
    console.log('xpress serverが起動 - ポート : ' + app.get('port'));
});
