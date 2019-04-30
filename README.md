# Give Me Shhheep 網站後台

版型參考六角學院提供之版型另做優化 [設計圖](https://hexschool.github.io/THE_F2E_Design/week3-admin%20order/?fbclid=IwAR3BZhORXJR4Bzb86_JY0ouU_wp9U7d78UGMA6sEDkQblK5zTZxm-gI2fJY)

Demo: [https://s3267920.github.io/GiveMeShhheepBackstage/dist/index.html](https://s3267920.github.io/GiveMeShhheepBackstage/dist/index.html)

[前台部分](https://github.com/s3267920/GiveMeShhheep)

## 整體

- Vue

- Vue Cli3

- Vue Router

- SCSS 純手刻

- firebase 資料庫串接

- json-server ＆ heroku 製作 Api

- 使用 firebase 做為資料庫及驗證

- loading 圖片為自行設計

- icon 部分使用 font awesome icon

---

### Login 登入 & Sign Up 註冊

- fireAuth 註冊及驗證
- 測試帳號：test@gmail.com
- 測試密碼：s123456789

** 可自行註冊或使用上述帳號登入，目前尚未使用信箱驗證信功能。
**

### Home 首頁

- ECharts 製作折線圖

### Orders 訂單管理

- 使用 json-server 架設在 heroku 上模擬 Api

### Product 產品管理

功能為 增加、修改、刪除

- 使用 firebase 做為資料庫及驗證
  - firestore 儲存資料
  - storage 儲存圖片

---

- **由於 firestorage 有容量限制，請勿增添過多資料進去**
- **如果看不到圖片，有可能是容量達到限制，請隔日五點後再試**
- **使用後請記得登出**
- **為了不影響前台，所以後台註冊用戶為獨立帳戶**
- **使用者只保留兩週，過後刪除**

---
