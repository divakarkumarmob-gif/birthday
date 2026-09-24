# 🤖 3D Birthday Universe - Telegram Bot Setup Guide

Yeh Telegram bot aapki birthday web app ke sath connect hokar:
1. **Surprise Links Generate** karta hai step-by-step chat wizard ke zariye (`/create`).
2. Girlfriend jab bhi live typewriter chat me questions ke answers degi, to **real-time Telegram alert** aapke phone par aayega! 💌
3. Saved answers history dekh sakte hain (`/answers`).
4. Web app URL ko update kar sakte hain (`/seturl`).

---

## 🚀 1. Telegram Bot Kaise Banayein (2 Minutes)

1. Telegram app open karein aur search karein: **`@BotFather`**
2. `/newbot` likhkar send karein.
3. Bot ka Name (e.g. `My Birthday Surprise Bot`) aur Username (e.g. `my_bday_love_bot`) enter karein.
4. `@BotFather` aapko ek **HTTP API Bot Token** dega (Example: `7123456789:AAFxAbcDeFgHiJkLmNoPqRsTuVwXyZ`).

---

## ⚙️ 2. Configuration (`bot_config.json`)

`bot_config.json` file ko open karein aur apna token paste karein:

```json
{
  "bot_token": "YOUR_ACTUAL_BOT_TOKEN_FROM_BOTFATHER",
  "owner_chat_id": "",
  "web_app_url": "http://localhost:8000",
  "api_port": 5000
}
```

---

## ▶️ 3. Bot Run Kaise Karein

Terminal / PowerShell me command chalayein:

```bash
## 📱 4. Bot Commands & Interactive Menu

- **`/start`** : Bot start hone par response dega:
  > `✨ Hello {Name}, welcome to surprise friends! 🎉💖`
- **`👤 User`** : View all registered users list with status & joined dates
- **`🟢 Active User`** : View currently active users
- **`🔴 Deactive`** : View & 1-click toggle/deactivate users
- **`🎁 Create Surprise`** (`/create`) : Interactive step-by-step surprise link generator
- **`💌 Chat Answers`** (`/answers`) : Girlfriend ke live chat answers dekhne ke liye
- **`🌐 Open Web App`** (`/webapp`) : 3D Birthday Web App direct link
- **`/seturl <url>`** : Web app ka live/deployed URL update karne ke liye
- **`/myid`** : Apna Telegram Chat ID dekhne ke liye
- **`❓ Help`** (`/help`) : Detailed commands help
