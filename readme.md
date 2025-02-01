
# Discord 成大學籍系統爬蟲機器人

<img src="src\readmeImg\good_layer.jpg" alt="Image" width="400"><br>

基於 `discord.js` 的Discord機器人，Nues0913 的陽春練習專案，<br>
目前正在尋求更安全的成大成績系統授權方法(試過 `OAuth 2.0` 但學校好像沒開放授權or我做不出來)，<br>
所以當前登入方法 `帳號密碼` 並不推薦使用，使用 `cookie` 的登入方法我做完後才發現蠻搞笑的。<br>


## 安裝

### 1. 安裝依賴：
若要在本地運行，請使用 `npm` 套件管理器安裝依賴：
```bash
npm install
```

### 2. 配置環境變量：
你可以自行於根目錄創建一個 `.env` 文件，在文件中加入以下環境變量：

```bash
TOKEN=your_discord_bot_token
CLIENT_ID=your_bot_client_id
GUILD_ID=your_guild_id
TESTER_ID=your_discord_user_id_for_reload_command
```

- `TOKEN` : [Discord.dev的機器人令牌](https://discord.com/developers/applications)
- `CLIENT_ID` : [Discord.dev的機器人客戶端 ID](https://discord.com/developers/applications)
- `GUILD_ID` : 你想要指令運行的伺服器ID
    > 或是你可以自行將 `main.js` 於<br>
    `rest.put(Routes.applicationCommands(CLIENT_ID, GUILD_ID), ...);`<br>
    之中的 `GUILD_ID` 移除，將其註冊成全域指令

- `TESTER_ID` : 重新加載命令的開發者的 Discord user ID。

### 4. 運行機器人
通過執行 `main.js` 運行機器人：
```bash
node ./main.js
```

## 使用

1. slashcommand: /grade_ncku

    此命令不會儲存任何使用者個人資料

    <img src="src\readmeImg\grade_ncku\selectMenu.png" alt="Image" width="400">

    <img src="src\readmeImg\grade_ncku\enter_account.png" alt="Image" width="400">

    <img src="src\readmeImg\grade_ncku\enter_cookie.png" alt="Image" width="400">

    <img src="src\readmeImg\grade_ncku\embed.png" alt="Image" width="400">

    寫文檔當下學校系統已更新故無資料，有成績資料時: 

    <img src="src\readmeImg\grade_ncku\embed2.png" alt="Image" width="400">

## 授權
所有代碼皆以 MIT 許可授權

> 請參照[LICENSE](LICENSE)。

