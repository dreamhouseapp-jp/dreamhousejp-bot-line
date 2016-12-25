"use strict";

let request = require('request'),
    LINE_ACCESS_TOKEN = process.env.LINE_ACCESS_TOKEN;

exports.send = (message,replyToken) => {
    request({
        url: 'https://api.line.me/v2/bot/message/reply',
        headers: {Authorization: "Bearer " + LINE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            replyToken: replyToken,
            messages: message
        }
    }, (error, response) => {
        if (error) {
            console.log('メッセージ送信でエラー: ', error);
        } else if (response.body.error) {
            console.log('エラー: ', response.body.error);
        }
    });
};

exports.getUserInfo = (source) => {

    return new Promise((resolve, reject) => {

        request({
            url: `https://api.line.me/v2/bot/profile/${source.userId}`,
            headers: {Authorization: "Bearer " + LINE_ACCESS_TOKEN},
            qs: {userId: source.userId},
            method: 'GET',
        }, (error, response) => {
            if (error) {
                console.log('メッセージ送信でエラー: ', error);
                reject(error);
            } else if (response.body.error) {
                console.log('エラー: ', response.body.error);
            } else {
                resolve(JSON.parse(response.body));
            }
        });
    });
};
