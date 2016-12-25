# LINE 用の Salesforce Bot

DreamHouse サンプルアプリケーションで使用する、Salesforce ベースのBotです。

Botのインスタンスを作成するには、以下の手順を実行します。

### ステップ 1：DreamHouse アプリをインストールする

DreamHouse サンプルアプリケーションをまだインストールしていない場合は、[この手順](http://dreamhouseappjp.io/installation/)を実行してインストールします。

### ステップ 2：接続アプリケーションを作成する

Salesforce 接続アプリケーションをまだ作成していない場合は、以下の手順を実行して作成します。

1. Salesforce の［設定］で、クイック検索ボックスに「**アプリ**」と入力して［**アプリケーション**］リンクをクリックします。

1. ［**接続アプリケーション**］セクションで、［**新規**］をクリックし、次のように接続アプリケーションを定義します。

    - 接続アプリケーション名：DreamhouseJpLineBot（または任意の名前）
    - API 参照名：DreamhouseJpLineBot
    - 取引先責任者メール：自分のメールアドレスを入力します。
    - OAuth 設定の有効化：チェックボックスをオンにします。
    - コールバック URL：sfdc://success (このURLは後で変更します)
    - 選択した OAuth 範囲：フルアクセス（full）
    - ［**保存**］をクリックします。

### ステップ 3：LINE Channelを作成する

1. [LINE ビジネスセンター](https://business.line.me/)及び [LINE ビジネスセンター](https://developers.line.me/) で、LINE Botタイプの LINE Channelsを作成します。

    - Channel Access Tokenは次のステップで利用するため、クリップボードに保持しておきます。

### ステップ 4：Herokuへデプロイする

1. [Heroku ダッシュボード](https://dashboard.heroku.com/)にログインしていることを確認します。
1. 下のボタンをクリックして、LINE Bot を Heroku にデプロイします。

  [![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

1. 以下の通りに環境変数を設定します。

    - ［**LINE_ACCESS_TOKEN**］：前のステップで作成したChannelのアクセストークンを入力します。
    - ［**SF_CLIENT_ID**］：Salesforce 接続アプリケーションのコンシューマキーを入力します。
    - ［**SF_CLIENT_SECRET**］：Salesforce 接続アプリケーションのコンシューマの秘密を入力します。
    - ［**SF_USER_NAME**］：Salesforce 統合ユーザーのユーザー名を入力します。
    - ［**SF_PASSWORD**］：Salesforce 統合ユーザーのパスワードを入力します。

### ステップ 5：接続設定とアクセス確認

1. LINE  Channelの **Webhook URL** の部分にデプロイした Heroku アプリの URL を入力し、末尾に /webhook を付加します。次に例を示します。
    ```
    https://myapp.herokuapp.com/webhook
    ```
1. Salesforceの [**接続アプリケーション**］セクションにある、コールバック URLをデプロイしたHerokuアプリのドメイン http://yourappname.herokuapp.com/oauthcallback.html へ変更します。

1. LINE Bot Channelにクライアントからアクセスし(チャネルページのQRコードで友達登録でいます)、メッセージを送信してみます。チャットBotに「**ヘルプ**」と入力し、返事が帰ってくる事を確認します。
