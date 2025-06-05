const axios = require("axios");

const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const LOGS_URL =
    "https://dashboard.render.com/web/srv-d0rf0kidbo4c73a9tru0/logs";

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

async function reportErrorToAdmin(
    error,
    contextMessage = "❗️Unexpected Error"
) {
    try {
        const message = `
⚠️ <b>Error Alert</b>
<b>Context:</b> ${escapeHtml(contextMessage)}
<b>Message:</b> ${escapeHtml(error.message)}
<pre>${escapeHtml((error.stack || "").split("\n").slice(0, 5).join("\n"))}</pre>
🔗 See Logs: ${LOGS_URL}
`.trim();

        console.error("❌ Reporting error to admin:", message);

        const res = await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                chat_id: ADMIN_CHAT_ID,
                text: message,
                parse_mode: "HTML",
                disable_web_page_preview: true,
            }
        );

        if (res.data.ok) {
            console.log("✅ Error reported to admin successfully.");
        } else {
            console.error(
                "❌ Failed to report error to admin:",
                res.data.description
            );
        }
    } catch (err) {
        console.error(
            "❌ Failed to report error to admin:",
            err.response?.data || err.message
        );
    }
}

module.exports = { reportErrorToAdmin };
