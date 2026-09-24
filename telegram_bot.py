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

def get_main_reply_keyboard():
    return {
        "keyboard": [
            [{"text": "👤 User"}, {"text": "🟢 Active User"}, {"text": "🔴 Deactive"}],
            [{"text": "🎁 Create Surprise"}, {"text": "💌 Chat Answers"}],
            [{"text": "🌐 Open Web App"}, {"text": "❓ Help"}]
        ],
        "resize_keyboard": True,
        "is_persistent": True
    }

def register_or_update_user(chat_id, user_name, raw_msg):
    if "registered_users" not in config:
        config["registered_users"] = {}
    
    uid = str(chat_id)
    username = raw_msg.get("from", {}).get("username", "")
    now_str = time.strftime("%d %b %Y, %I:%M %p")

    if uid not in config["registered_users"]:
        config["registered_users"][uid] = {
            "id": chat_id,
            "name": user_name,
            "username": f"@{username}" if username else "N/A",
            "status": "active",
            "joined_at": now_str,
            "last_seen": now_str
        }
        save_config(config)
    else:
        config["registered_users"][uid]["name"] = user_name
        if username:
            config["registered_users"][uid]["username"] = f"@{username}"
        config["registered_users"][uid]["last_seen"] = now_str
        save_config(config)

def process_user_message(chat_id, user_name, text, raw_msg):
    register_or_update_user(chat_id, user_name, raw_msg)
    session = user_sessions.get(chat_id)
    cmd = text.strip().lower()

    # 1. /start command
    if cmd == "/start" or cmd == "start":
        user_sessions.pop(chat_id, None)
        welcome_text = (
            f"✨ <b>Hello {user_name}, welcome to surprise friends!</b> 🎉💖\n\n"
            "This bot connects directly with your 3D Birthday Web App.\n\n"
            "📋 <b>Bot Menu:</b>\n"
            "• 👤 <b>User:</b> View all registered users\n"
            "• 🟢 <b>Active User:</b> View currently active users\n"
            "• 🔴 <b>Deactive:</b> View & toggle deactivated users\n"
            "• 🎁 <b>Create Surprise:</b> Generate customized birthday link\n"
            "• 💌 <b>Chat Answers:</b> Live girlfriend replies sync\n\n"
            "Choose any option from the menu below:"
        )
        inline_keyboard = {
            "inline_keyboard": [
                [{"text": "👤 User", "callback_data": "menu_users"}, {"text": "🟢 Active User", "callback_data": "menu_active"}, {"text": "🔴 Deactive", "callback_data": "menu_deactive"}],
                [{"text": "🎁 Create Surprise Link", "callback_data": "start_create"}],
                [{"text": "💌 View Saved Chat Answers", "callback_data": "view_answers"}],
                [{"text": "🌐 Open Birthday Web App", "url": config.get("web_app_url", "http://localhost:8000")}]
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
    elif cmd in ["🟢 active user", "active user", "/active", "/activeuser", "/activeusers"]:
        show_active_users(chat_id)
        return

    # 4. 🔴 Deactive command
    elif cmd in ["🔴 deactive", "deactive", "deactivate", "/deactive", "/deactivate"]:
        show_deactive_users(chat_id)
        return

    # 5. 🎁 Create Surprise
    elif cmd in ["🎁 create surprise", "create surprise", "/create"]:
        start_create_wizard(chat_id)
        return

    # 6. 💌 Chat Answers
    elif cmd in ["💌 chat answers", "chat answers", "/answers"]:
        show_saved_answers(chat_id)
        return

    # 7. 🌐 Open Web App
    elif cmd in ["🌐 open web app", "open web app", "/webapp"]:
        url = config.get("web_app_url", "http://localhost:8000")
        send_tg_message(chat_id, f"🌐 <b>Birthday Web App Link:</b>\n{url}", reply_markup={
            "inline_keyboard": [[{"text": "🚀 Open Web App Now", "url": url}]]
        })
        return

    # 8. /help command
    elif cmd in ["❓ help", "help", "/help"]:
        help_text = (
            "📖 <b>Surprise Friends Bot Commands:</b>\n\n"
            "• <code>👤 User</code> - List all registered users\n"
            "• <code>🟢 Active User</code> - List all active users\n"
            "• <code>🔴 Deactive</code> - View/toggle deactivated users\n"
            "• <code>🎁 Create Surprise</code> - Interactive link generator\n"
            "• <code>💌 Chat Answers</code> - View girlfriend's answers\n"
            "• <code>/seturl &lt;url&gt;</code> - Set Web App host URL\n"
            "• <code>/myid</code> - View your Telegram Chat ID"
        )
        send_tg_message(chat_id, help_text, reply_markup=get_main_reply_keyboard())
        return

    # 9. /myid command
    elif cmd == "/myid":
        send_tg_message(chat_id, f"🆔 <b>Your Telegram Chat ID:</b> <code>{chat_id}</code>")
        return

    # 10. /seturl command
    elif text.startswith("/seturl"):
        parts = text.split(maxsplit=1)
        if len(parts) > 1:
            new_url = parts[1].strip()
            config["web_app_url"] = new_url
            save_config(config)
            send_tg_message(chat_id, f"✅ <b>Web App URL updated to:</b>\n<code>{new_url}</code>", reply_markup=get_main_reply_keyboard())
        else:
            send_tg_message(chat_id, "⚠️ Usage: <code>/seturl https://your-site.com</code>")
        return

    # 11. Wizard Steps
    if session:
        step = session.get("step")

        if step == "name":
            session["name"] = text
            session["step"] = "nickname"
            send_tg_message(chat_id, f"💖 Awesome! Name set to: <b>{text}</b>\n\nNow enter their sweet <b>Pet / Love Nickname</b> (e.g. <i>Princess, My Queen, Jaan, Hero</i>):")
            return

        elif step == "nickname":
            session["nickname"] = text
            session["step"] = "age"
            send_tg_message(chat_id, f"👑 Nickname set to: <b>{text}</b>\n\nWhat is their <b>Age</b>? (Enter number like <code>21</code> or type <code>skip</code>):")
            return

        elif step == "age":
            session["age"] = "" if text.lower() == "skip" else text
            session["step"] = "theme"
            keyboard = {
                "inline_keyboard": [
                    [{"text": "🌸 Rose Glamour (Romantic Pink)", "callback_data": "theme_rose-glamour"}],
                    [{"text": "✨ Midnight Gold (Royal Luxury)", "callback_data": "theme_midnight-gold"}],
                    [{"text": "⚡ Cyber Neon (Party Glow)", "callback_data": "theme_cyber-neon"}],
                    [{"text": "💜 Cosmic Violet (Nebula)", "callback_data": "theme_cosmic-purple"}]
                ]
            }
            send_tg_message(chat_id, "🎨 Select the <b>3D Theme Style</b>:", reply_markup=keyboard)
            return

        elif step == "wish":
            session["wish"] = text
            session["step"] = "photo"
            send_tg_message(
                chat_id,
                "💌 <b>Heartfelt Wish saved!</b>\n\n"
                "📸 Now send a <b>Portrait Photo</b> of the celebrant directly in this chat, or send an image URL (or type <code>skip</code> for default 3D Badge):"
            )
            return

        elif step == "photo":
            photo_url = ""
            if "photo" in raw_msg:
                try:
                    file_id = raw_msg["photo"][-1]["file_id"]
                    f_res = requests.get(f"{BASE_TG_URL}/getFile?file_id={file_id}").json()
                    if f_res.get("ok"):
                        file_path = f_res["result"]["file_path"]
                        photo_url = f"https://api.telegram.org/file/bot{BOT_TOKEN}/{file_path}"
                except Exception as err:
                    print(f"Error fetching photo: {err}")
            elif text.startswith("http://") or text.startswith("https://"):
                photo_url = text
            
            session["photo"] = photo_url
            finish_create_wizard(chat_id, session)
            user_sessions.pop(chat_id, None)
            return

    # Default fallback
    send_tg_message(chat_id, "Type /start or choose an option from the menu below! ✨", reply_markup=get_main_reply_keyboard())

def show_all_users(chat_id):
    users = config.get("registered_users", {})
    if not users:
        send_tg_message(chat_id, "👤 <b>No users registered yet!</b>", reply_markup=get_main_reply_keyboard())
        return

    msg = f"👥 <b>REGISTERED USERS ({len(users)})</b>\n\n"
    keyboard_buttons = []

    for uid, u in users.items():
        st_icon = "🟢 Active" if u.get("status") == "active" else "🔴 Deactive"
        msg += (
            f"• <b>Name:</b> {u.get('name', 'Unknown')}\n"
            f"  <b>Username:</b> {u.get('username', 'N/A')}\n"
            f"  <b>Status:</b> {st_icon}\n"
            f"  <b>ID:</b> <code>{uid}</code>\n"
            f"  <b>Joined:</b> {u.get('joined_at', 'N/A')}\n\n"
        )
        toggle_label = "🔴 Deactivate" if u.get("status") == "active" else "🟢 Activate"
        keyboard_buttons.append([{"text": f"{toggle_label} {u.get('name')}", "callback_data": f"toggle_user_{uid}"}])

    keyboard = {"inline_keyboard": keyboard_buttons} if keyboard_buttons else None
    send_tg_message(chat_id, msg, reply_markup=keyboard)

def show_active_users(chat_id):
    users = config.get("registered_users", {})
    active_users = {k: v for k, v in users.items() if v.get("status", "active") == "active"}

    if not active_users:
        send_tg_message(chat_id, "🟢 <b>No active users right now!</b>", reply_markup=get_main_reply_keyboard())
        return

    msg = f"🟢 <b>ACTIVE USERS ({len(active_users)})</b>\n\n"
    keyboard_buttons = []

    for uid, u in active_users.items():
        msg += (
            f"✅ <b>{u.get('name', 'Unknown')}</b> ({u.get('username', 'N/A')})\n"
            f"  <b>ID:</b> <code>{uid}</code>\n"
            f"  <b>Last Active:</b> {u.get('last_seen', 'N/A')}\n\n"
        )
        keyboard_buttons.append([{"text": f"🔴 Deactivate {u.get('name')}", "callback_data": f"toggle_user_{uid}"}])

    keyboard = {"inline_keyboard": keyboard_buttons} if keyboard_buttons else None
    send_tg_message(chat_id, msg, reply_markup=keyboard)

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

    if cb_data == "start_create":
        start_create_wizard(chat_id)

    elif cb_data == "view_answers":
        show_saved_answers(chat_id)

    elif cb_data == "menu_users":
        show_all_users(chat_id)

    elif cb_data == "menu_active":
        show_active_users(chat_id)

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

    # Run Telegram Bot Polling in main thread
    handle_updates()
