const { Client } = require("@notionhq/client");
const { Telegraf } = require("telegraf");
const decryptAndValidate = require("./utils/decryptAndValidate");
const questions = require("./utils/questions");

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

async function sendTelegramMessage(username, message) {
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
}

async function saveToNotion(parsedData) {
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

    const decrypted = decryptAndValidate(form);

    const replyMessage = (status, reason = "") => `
*وضعیت ثبت بازخورد:* ${
        status === "success" ? "✅ ارسال‌شده با موفقیت" : "❌ ارسال ناموفق"
    }
${reason ? `*خطا:* ${reason}` : ""}

👤 *فرستنده:* ${"decrypted.username" || "نامشخص"}
👤 *دریافت‌کننده:* ${"mentorName" || "نامشخص"}

📊 *ارزیابی عددی (با مقیاس ۱ تا ۵)
۱ = بسیار ضعیف | ۵ = عالی:*

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
            replyMessage("fail", "لینک منقضی شده است.")
        );
        return;
    }

    if (decrypted.error) {
        console.log("❌ Decryption failed.");
        await sendTelegramMessage(
            decrypted.username,
            replyMessage("fail", "خطا در رمزگشایی لینک.")
        );
        return;
    }

    const mentorId = mentorField?.value?.[0];
    const mentorOption = mentorField?.options?.find(
        (opt) => opt.id === mentorId
    );
    const mentorName = mentorOption?.text || "ناشناخته";

    const score =
        (Number(q1_1) +
            Number(q1_2) +
            Number(q1_3) +
            Number(q1_4) +
            Number(q1_5)) /
        5;

    try {
        await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                sender: {
                    rich_text: [{ text: { content: decrypted.username } }],
                },
                reciver: {
                    rich_text: [{ text: { content: mentorName } }],
                },
                "q1-1": { number: Number(q1_1) },
                "q1-2": { number: Number(q1_2) },
                "q1-3": { number: Number(q1_3) },
                "q1-4": { number: Number(q1_4) },
                "q1-5": { number: Number(q1_5) },
                "q2-1": {
                    rich_text: [{ text: { content: q2_1 || "ثبت نشده" } }],
                },
                "q2-2": {
                    rich_text: [{ text: { content: q2_2 || "ثبت نشده" } }],
                },
                "q2-3": {
                    rich_text: [{ text: { content: q2_3 || "ثبت نشده" } }],
                },
                score: { number: score },
            },
        });

        await sendTelegramMessage(decrypted.username, replyMessage("success"));
    } catch (err) {
        console.error("❌ Error saving to Notion:", err.message);
        await sendTelegramMessage(
            decrypted.username,
            replyMessage("fail", "خطا در ذخیره در Notion")
        );
    }
}

module.exports = { saveToNotion };
