"use strict";

let salesforce = require('./salesforce'),
    line = require('./line'),
    formatter = require('./formatter');

exports.schedule_visit = (source,replyToken, values) => {
    salesforce.findProperties({id: values[1]}).then(properties => {
        line.send([formatter.formatAppointment(properties[0])], replyToken);
    });
};

exports.contact_broker = (source,replyToken, values) => {
    let propertyId;
    salesforce.findProperties({id: values[1]}).then(properties => {
      propertyId = properties[0].getId();
      return salesforce.getBroker(properties[0].get("broker__c"));
    }).then(broker => {
      line.send([{type:`text`,text: "こちらが物件の担当者情報となります"},formatter.formatBroker(broker,propertyId)], replyToken);
    });
};

exports.confirm_nlp = (source,replyToken, values) => {
  salesforce.findProperties({city: values[1]}).then(properties => {
      line.send([{type:`text`,text: `"${values[1]}" 近辺で "${values[2]}" の物件を検索した結果を表示しています。`},formatter.formatProperties(properties)], replyToken);
  });
};

exports.confirm_visit = (source,replyToken, values) => {
  line.getUserInfo(source).then(response => {
      salesforce.createCase("内覧予約",values[1], response.displayName,source.userId).then(() => {
        line.send([{type:`text`,text: `かしこまりました。内覧のスケジュールを確定いたしました。 場所:${values[2]} 日時:${values[3]} 。`}], replyToken);
      });
  });
};

exports.contact_me = (source,replyToken, values) => {

    line.getUserInfo(source).then(response => {
        salesforce.createCase("ご連絡を希望",values[1],response.displayName,source.userId).then(() => {
            line.send([{type:`text`,text: `ありがとうございます。 ${response.displayName} さんに担当者からご連絡をさせて頂きます。 `}], replyToken);
        });
    });

};

exports.confirm_cancel = (source,replyToken, values) => {
  line.send([{type:`text`,text: `大変失礼致しました。処理をキャンセルします。質問は単純にするほど理解しやすくなります。`}], replyToken);
};
