const { Client } = require("@notionhq/client");
const decryptAndValidate = require("./utils/decryptAndValidate");
const { telegramService } = require("./utils/telegramService");
const { reportErrorToAdmin } = require("./utils/errorReporter");

const notion = new Client({ auth: process.env.NOTION_API_KEY_ANS });
const databaseId = process.env.NOTION_DATABASE_ID_ANS;

async function saveToNotion(parsedData, submissionId, createdAt) {
    try {
        const {
            form,
            send,
            "q1-1": q1_1,
            "q1-2": q1_2,
            "q1-3": q1_3,
            "q1-4": q1_4,
            "q1-5": q1_5,
            "q2-1": q2_1,
            "q2-2": q2_2,
            "q2-3": q2_3,
        } = parsedData;

        const decryptedForm = decryptAndValidate(form, false);
        const decryptedSend = decryptAndValidate(send, true);

        if (!decryptedForm?.username || !decryptedSend?.username) {
            throw new Error(
                "❌ Missing sender or receiver username after decryption"
            );
        }

        const score =
            (Number(q1_1) +
                Number(q1_2) +
                Number(q1_3) +
                Number(q1_4) +
                Number(q1_5)) /
            5;

        // Save to Notion
        await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                sender: {
                    rich_text: [{ text: { content: decryptedForm.username } }],
                },
                receiver: {
                    rich_text: [{ text: { content: decryptedSend.username } }],
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
                "Feedback ID": {
                    title: [{ text: { content: submissionId } }],
                },
                createdAt: {
                    date: { start: createdAt },
                },
            },
        });

        // Send Telegram Message
        try {
            await telegramService(decryptedForm, decryptedSend, parsedData);
        } catch (telegramError) {
            console.error("❌ Telegram Error:", telegramError);
            await reportErrorToAdmin(
                telegramError,
                `📡 Telegram Send Error\nSender: @${decryptedForm.username}\nReceiver: @${decryptedSend.username}`
            );
        }
    } catch (mainError) {
        console.error("❌ Notion Save Error:", mainError);
        const sender = parsedData?.form
            ? decryptAndValidate(parsedData.form, false)?.username
            : "Unknown";
        const receiver = parsedData?.send
            ? decryptAndValidate(parsedData.send, true)?.username
            : "Unknown";

        await reportErrorToAdmin(
            mainError,
            `📝 Notion Save Error\nSender: @${sender}\nReceiver: @${receiver}`
        );
    }
}

module.exports = { saveToNotion };
