"use strict";

let salesforce = require('./salesforce'),
    line = require('./line'),
    formatter = require('./formatter'),
    fetchUrl = require('fetch').fetchUrl,
    request = require('request');

exports.searchHouse = (source,replyToken) => {
    salesforce.findProperties().then(properties => {
        line.send([{type:`text`,text: `現在売り出し中の物件を検索した結果をご案内します。`},formatter.formatProperties(properties)], replyToken);
    });
};

exports.searchHouse_City = (source,replyToken,values) => {
    salesforce.findProperties({city: values[1]}).then(properties => {
        line.send([{type:`text`,text: `場所:${values[1]} の物件を検索した結果をご案内いたします。`},formatter.formatProperties(properties)], replyToken);
    });
};

exports.searchHouse_NLP = (source,replyToken,values) => {
    line.send([formatter.formatNLP(values)], replyToken);
};

exports.searchHouse_Bedrooms_City_Range = (source,replyToken,values) => {
    var priceMin = values[3] <= 1000000 ? values[3] * 10000 : values[3];
    var priceMax = values[4] <= 1000000 ? values[4] * 10000 : values[4];
    salesforce.findProperties({bedrooms: values[1], city: values[2], priceMin: priceMin, priceMax: priceMax}).then(properties => {
        line.send([{type:`text`,text: `部屋数:${values[1]} 場所:${values[2]} 価格帯: ${values[3]} から ${values[4]} の物件を検索した結果をご案内します。`},formatter.formatProperties(properties)], replyToken);
    });
};

exports.searchHouse_Bedrooms_City = (source,replyToken,values) => {
    salesforce.findProperties({bedrooms: values[1], city: values[2]}).then(properties => {
        line.send([{type:`text`,text: `部屋数:${values[1]} 場所:${values[2]} の物件を検索した結果をご案内します。`},formatter.formatProperties(properties)], replyToken);
    });
};

exports.searchHouse_Bedrooms = (source,replyToken, values) => {
    salesforce.findProperties({bedrooms: values[1]}).then(properties => {
        line.send([{type:`text`,text: `部屋数:${values[1]}の物件を検索した結果をご案内します。`},formatter.formatProperties(properties)], replyToken);
    });
};

exports.searchHouse_Range = (source,replyToken,values) => {
    var priceMin = values[1] <= 100000 ? values[1] * 10000 : values[1];
    var priceMax = values[1] <= 100000 ? values[2] * 10000 : values[2];
    salesforce.findProperties({priceMin: priceMin, priceMax: priceMax}).then(properties => {
        line.send([{type:`text`,text: `価格帯:${values[1]}から${values[2]}の物件を検索した結果をご案内します。`},formatter.formatProperties(properties)], replyToken);
    });
};

exports.priceChanges = (source,replyToken,values) => {
    salesforce.findPriceChanges().then(priceChanges => {
        line.send([{type:`text`,text: `かしこまりました。直近の価格変更を検索しています...`},formatter.formatPriceChanges(priceChanges)], replyToken);
    });
};

exports.notInterested = (source,replyToken) => {
    line.send([{type:`text`, text: `申し訳ございません。どのようなお住まいをお探しでしょうか? もし画像を添付していただけたら、それに似た物件をお探しします。`}], replyToken);
};

exports.hi = (source,replyToken) => {
    line.getUserInfo(source).then(response => {
      if(response.statusMessage){
        line.send([{type:`text`,text: `こんにちは。 ${response.displayName} さん!\n「${response.statusMessage}」って、なんかいい響きですね。`}], replyToken);
      }else{
        line.send([{type:`text`,text: `こんにちは。 ${response.displayName} さん!\nステータスメッセージは入れないんですか？`}], replyToken);
      }
    });
};

exports.help = (source,replyToken) => {
    line.send([{type:`text`,text: `ようこそドリームハウスへ。\n物件はメッセージから検索することもできます。 「場所:品川」、「部屋数:3 場所:品川」、「部屋数:3 場所:品川 価格:5000から7500の間」、 「価格変更」 などのように、さまざまなキーワードを使って条件を指定できます`}], replyToken);
};

exports.unknown = (source,replyToken) => {
    line.send([{type:`text`,text: `申し訳ございません。リクエストの内容を認識できません。 \n「ヘルプ」 とメッセージを頂ければ物件の検索方法をお送りいたします`}], replyToken);
};
