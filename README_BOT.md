# 🤖 3D Birthday Studio - Telegram Bots System Guide

Aapke Birthday Web App ke sath 2 dedicated bots ka system tayar hai:

---

## 👑 1. Owner Telegram Bot (`telegram_bot.py`)
> **Security:** Sirf **Owner** (`7034154766`) ke liye private hai. Koi bhi random user access nahi kar sakta.

### 📋 3-Line Menu Options:
1. **`👤 User` (`/user`)**: Website par login/register karne wale sabhi users ki numbered list (`1. 2. 3. ...`) unke **Username** aur **Password** ke sath show karta hai.
2. **`🟢 Active User` (`/active_user`)**: Sirf un users ko show karta hai jo **usi din login kiye hon** ya jinka **Surprise Link active ho (`< 48 hours`)**.
3. **`🌐 Open Web App` (`/webapp`)**: Web App (`http://localhost:8000/`) open karne ka button & link.

### ▶️ Run Command:
```bash
python telegram_bot.py
```
*(Yeh script automatic background me port 5000 par API server aur 48h auto-deletion loop bhi run karti hai).*

---

## 👥 2. Public / Random User Telegram Bot (`public_user_bot.py`)
> **Target Audience:** Kisi bhi **Random User / Public Users** ke liye open hai.

### 📋 3-Line Menu & Keyboard Options:
1. **`🆕 New User Login` (`/register`)**: Naya user register karke username aur password set karta hai.
2. **`🔑 Existing User Login` (`/login`)**: Existing user login karta hai.
3. **`🎁 Create Surprise` (`/create`)**: Step-by-step 3D surprise creation wizard (GF/BF, Name, Nickname, Theme, Romantic Wish) jo 48-hour active link banata hai.
4. **`💌 Chat Answer` (`/answers`)**:
   - **Login Check:** Agar user login nahi hai, to pehle login/register karne ka prompt aayega.
   - **Q&A Display:** Partner dwara chat me diye gaye questions aur answers format me dikhayega:
     ```text
     Q1. Question: Hey prettiest girl... 💕
     💬 Answer: "Aww so sweet! 💕"
     👤 From: Priya | ⏱ 15:12
     ```
5. **`🔗 Share Data` (`/share`)**: User ke create kiye gaye surprise ka active link, time remaining (`47h 50m left`), aur data dikhata hai.
6. **`🌐 Open Web App` (`/webapp`)**: Web App open karne ka link.
7. **`❓ Help & DM Owner` (`/help`)**:
   - `🗑️ Delete Account & Data`: Password enter karne par permanent account delete karne ka option.
   - `💬 DM Owner`: Owner se direct Telegram par baat karne ka link (`@Mr_anssh00`).

### ▶️ Run Command:
```bash
python public_user_bot.py
```

---

## ⚙️ Configuration (`bot_config.json`)
```json
{
  "bot_token": "YOUR_OWNER_BOT_TOKEN",
  "public_bot_token": "YOUR_PUBLIC_USER_BOT_TOKEN (Optional, defaults to bot_token)",
  "owner_chat_id": "7034154766",
  "web_app_url": "http://localhost:8000/",
  "api_port": 5000
}
```
