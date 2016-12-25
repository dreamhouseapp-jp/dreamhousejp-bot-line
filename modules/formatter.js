"use strict";

let moment = require("moment"),
    numeral = require("numeral");

moment.locale('ja', {
    weekdays: ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],
    weekdaysShort: ["日","月","火","水","木","金","土"],
});

exports.formatProperties = properties => {
    let columns = [];
    properties.forEach(property => {
            columns.push({
                thumbnailImageUrl : property.get("Picture__c"),
                title: property.get("Title__c"),
                text: `${property.get("Address__c")}, ${property.get("City__c")} ${property.get("State__c")} · ￥${numeral(property.get("Price__c")).format('0,0')}`,
                "actions": [
                    {
                        "type": "postback",
                        "label": "内覧を予約",
                        "data": "schedule_visit," + property.getId()
                    },
                    {
                        "type": "postback",
                        "label": "担当者を表示",
                        "data": "contact_broker," + property.getId()
                    },
                    {
                        "type": "postback",
                        "label": "連絡を希望",
                        "data": "contact_me," + property.getId()
                    }
                ]
            })
        }
    );
    return {
      type: "template",
      altText: "物件リスト",
      template: {
          type: "carousel",
          columns: columns
      }
    };
};

exports.formatPriceChanges = priceChanges => {
    let columns = [];
    priceChanges.forEach(priceChange => {
            let property = priceChange.get("Parent");
            columns.push({
                thumbnailImageUrl : property.get("Picture__c"),
                title: `${property.Address__c}, ${property.City__c} ${property.State__c}`,
                text: `過去の価格: ￥${numeral(priceChange.get("OldValue")).format('0,0')} · 新しい価格: ￥${numeral(priceChange.get("NewValue")).format('0,0')} 変更日: ${moment(priceChange.get("CreatedDate")).format("MM/DD (ddd)")}`,
                "actions": [
                    {
                        "type": "postback",
                        "label": "内覧を予約",
                        "data": "schedule_visit," + property.Id
                    },
                    {
                        "type": "postback",
                        "label": "担当者を表示",
                        "dagta": "contact_broker," + property.Id
                    },
                    {
                        "type": "postback",
                        "label": "連絡を希望",
                        "data": "contact_me," + property.Id
                    }
                ]
            })
        }
    );
    return [{
      type: "template",
      altText: "価格変更リスト",
      template: {
          type: "carousel",
          columns: columns
      }
    }];
};


exports.formatAppointment = property => {
    var options = [
        moment().add(1, 'days').format('MM/DD (ddd)') + ' 午前10時',
        moment().add(2, 'days').format('MM/DD (ddd)') + ' 午前9時',
        moment().add(2, 'days').format('MM/DD (ddd)') + ' 午後5時',
        moment().add(3, 'days').format('MM/DD (ddd)') + ' 午後1時',
        moment().add(3, 'days').format('MM/DD (ddd)') + ' 午後6時',
    ];
    return {
        type: "template",
        altText: "日程選択",
        template: {
            type: "buttons",
            title: "日程選択",
            text: `以下の中から ${property.get("City__c")} - ${property.get("Address__c")} の物件への内覧可能な日程を選択してください。`,
            actions: [
                {
                    "type": "postback",
                    "label": options[0],
                    "data": "confirm_visit," + property.getId() + ", " + property.get("Address__c") + "  (" + property.get("City__c") + ")," + options[0]
                },
                {
                    "type": "postback",
                    "label": options[1],
                    "data": "confirm_visit," + property.getId() + ", " + property.get("Address__c") + "  (" + property.get("City__c") + ")," + options[1]
                },
                {
                    "type": "postback",
                    "label": options[2],
                    "data": "confirm_visit," + property.getId() + ", " + property.get("Address__c") + "  (" + property.get("City__c") + ")," + options[2]
                }]
        }
    };
};

exports.formatBroker = (broker,propertyId) => {
    return {
      "type": "template",
      "altText": "担当者の情報",
      "template": {
          "type": "buttons",
          "thumbnailImageUrl": broker.get("picture__c"),
          "title": broker.get("name"),
          "text": broker.get("title__c") + " · " + broker.get("phone__c") + " · " +  broker.get("email__c"),
          "actions": [
            {
              "type": "postback",
              "label": "連絡を希望",
              "data": "contact_me," + propertyId
            }
          ]
        }
    };
};

exports.formatNLP = values => {
    return {
      "type": "template",
      "altText": "問い合わせ確認",
      "template": {
          "type": "buttons",
          "text": `お問い合わせありがとうございます。"${values[1]}" 近辺で "${values[2]}" の物件をお探し。という理解で宜しいでしょうか？`,
          "actions": [
              {
                  "type": "postback",
                  "label": "はい",
                  "data": "confirm_nlp," + values[1] + ", " + values[2]
              },
              {
                  "type": "postback",
                  "label": "いいえ",
                  "data": "confirm_cancel"
              }]
      }
    };
};
