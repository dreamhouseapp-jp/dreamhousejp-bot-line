"use strict";

let line = require('./line'),
    formatter = require('./formatter'),
    salesforce = require('./salesforce'),
    request = require('request'),
    visionService = require('./vision-service0'),
    LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;

exports.processUpload = (source, replyToken,messageId) => {

    let targetImageData = null;
    request({
        url: `https://api.line.me/v2/bot/message/${messageId}/content`,
        headers: {Authorization: "Bearer " + LINE_ACCESS_TOKEN},
        method: 'GET',
        encoding: null,
        qs: {messageId: messageId}
    }, (error, response) => {
        if (error) {
            console.log('メッセージ送信でエラー: ', error);
        } else if (response.body.error) {
            console.log('エラー: ', response.body.error);
        }else{
            var mdhousetype;
            targetImageData = response.body;
            var targetImageBase64 = targetImageData.toString('base64');
            visionService.classify(targetImageBase64)
                .then(houseType => {
                    mdhousetype = houseType;
                    return salesforce.findPropertiesByCategory(houseType);
                })
                .then(properties => line.send([{type:'text',text: `画像の分析の結果、 "${mdhousetype}" なカテゴリの住居とがイメージと近いです。以下がオススメのお部屋です`},formatter.formatProperties(properties)], replyToken));
        }
    });
};
