# BDS BOT — King Muhammad

BDS BOT is a Node.js dashboard plus a WhatsApp Web bot built with the unofficial Baileys library. It includes a responsive neon-green dashboard, protected pairing endpoint, health endpoint, command catalogue, and starter handlers.

## Important notes
- Baileys is an **unofficial** WhatsApp Web integration. WhatsApp may change its protocol or restrict accounts using unofficial clients. Use at your own risk and do not use it for spam.
- This starter does not pretend a pairing code means the bot is connected. The server only reports connected after Baileys actually connects.
- Keep your `.env` and `auth_info_bds/` private. Never upload them to GitHub. Anyone who gets your auth files may control your WhatsApp session.
- Many commands in the catalogue are listed as requested but are **not implemented yet**. The bot responds with a clear “not implemented yet” message instead of falsely claiming they work.
- Keep group moderation commands permission-checked. Avoid mass actions and respect other members.

## Run it
Requires Node.js 20 or newer.

1. Download/clone this repository.
2. Copy `.env.example` to `.env`.
3. Set `BOT_ADMIN_TOKEN` to a new, long random secret. Do not use a token posted in a chat or commit it to GitHub.
4. Run `npm install`
5. Run `npm start`
6. Open `http://localhost:3000`

## Pairing from the dashboard
1. Open the dashboard and choose **Generate Pairing Code**.
2. Enter your WhatsApp phone number with country code, digits only (for example, `2348012345678`).
3. Enter your `BOT_ADMIN_TOKEN` in the admin token field.
4. Submit, then in WhatsApp on your phone go to **Linked devices → Link a device → Link with phone number** and enter the code shown.
5. Keep the server running. The dashboard status updates when the connection state changes.

Pairing requests are protected by the admin token. Do not expose the dashboard publicly without HTTPS and a strong token. Some hosting providers have ephemeral disks; if the filesystem is reset, the WhatsApp session may be lost. For persistent operation, use a host with a persistent disk or a private always-on machine.

## GitHub upload
Upload the project files, but **do not upload** `.env`, `node_modules/`, or `auth_info_bds/`. `.gitignore` already excludes them.

## Deploying
`render.yaml` is a starting point for a Node 20 web service. A free hosting plan may sleep, restart, or have ephemeral storage and therefore is not suitable for guaranteed 24/7 WhatsApp connectivity. Use persistent storage if you want the session to survive redeployments.

## Included endpoints
- `GET /health` — status only, no secrets.
- `GET /api/status` — bot status, safe for dashboard polling.
- `POST /api/pair` — protected pairing request. JSON body: `{ "phone": "2348012345678", "token": "your-admin-token" }`.
- `POST /api/disconnect` — protected disconnect request.

## Command catalogue
The help menu is generated from `src/commands.js`, so its count is derived from the actual catalogue. A catalogue entry is not a promise that every command has a handler yet.
