const { Telegraf } = require("telegraf");
const questions = require("./questions");
const parseMentorsName = require("./parseMentorsName");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

const sendTelegramMessage = async (username, message) => {
    console.log("📩 Sending Telegram message to:", username);
    console.log("📩 Message content:", message);

    if (!username) return;

    try {
        await bot.telegram.sendMessage(`${"573124085"}`, message, {
            parse_mode: "Markdown",
        });
    } catch (err) {
        console.error("❌ Error sending Telegram message:", err);
    }
};

const telegramService = async (decrypted, parsedData) => {
    const {
        form,
        mentorField,
        "q1-1": q1_1,
        "q1-2": q1_2,
        "q1-3": q1_3,
        "q1-4": q1_4,
        "q1-5": q1_5,
        "q2-1": q2_1,
        "q2-2": q2_2,
        "q2-3": q2_3,
    } = parsedData;

    const mentorName = parseMentorsName(mentorField);

    const replyMessage = (status, reason = "") => `
*وضعیت ثبت بازخورد:* ${
        status === "success" ? "✅ ارسال‌شده با موفقیت" : "❌ ارسال ناموفق"
    }
${reason ? `*خطا:* ${reason}` : ""}

👤 *فرستنده:* @${decrypted.username || "نامشخص"}
👤 *دریافت‌کننده:* ${mentorName || "نامشخص"}

📊 *ارزیابی عددی (با مقیاس ۱ تا ۵)*
۱ = بسیار ضعیف | ۵ = عالی:

${questions.q1_1}  
⭐️ *امتیاز:* ${q1_1}

${questions.q1_2}  
⭐️ *امتیاز:* ${q1_2}

${questions.q1_3}  
⭐️ *امتیاز:* ${q1_3}

${questions.q1_4}  
⭐️ *امتیاز:* ${q1_4}

${questions.q1_5}  
⭐️ *امتیاز:* ${q1_5}

💬 *سوالات تشریحی:*

${questions.q2_1}  
🗒️ ${q2_1 || "پاسخی ثبت نشده"}

${questions.q2_2}  
🗒️ ${q2_2 || "پاسخی ثبت نشده"}

${questions.q2_3}  
🗒️ ${q2_3 || "پاسخی ثبت نشده"}
`;

    if (decrypted.error === "expired") {
        console.log("❌ Link expired.");
        await sendTelegramMessage(
            decrypted.username,
            replyMessage(
                "fail",
                "لینک منقضی شده است. لطفا لینک جدید بسازید و دوباره فرم را پر کنید."
            )
        );
        return;
    }

    if (decrypted.error) {
        console.log("❌ Decryption failed.", decrypted.username);
        return;
    }

    await sendTelegramMessage(decrypted.username, replyMessage("success"));
};

module.exports = {
    telegramService,
};
