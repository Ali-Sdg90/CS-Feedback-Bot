const { Telegraf } = require("telegraf");
const questions = require("./questions");
const getTelegramIdByUsername = require("./getTelegramIdByUsername");

const buildSenderSuccessMessage = require("./telegramMessageTemplate/buildSenderSuccessMessage");
const buildSenderErrorMessage = require("./telegramMessageTemplate/buildSenderErrorMessage");
const buildReceiverMessage = require("./telegramMessageTemplate/buildReceiverMessage");
const buildAdminLogMessage = require("./telegramMessageTemplate/buildAdminLogMessage");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

const sendTelegramMessage = async (chatId, message) => {
    // console.log("📩 Sending Telegram message to:", chatId);
    // console.log("📩 Message content:\n", message);

    if (!chatId) return;

    try {
        await bot.telegram.sendMessage(chatId, message, {
            parse_mode: "HTML",
        });
    } catch (err) {
        console.error("❌ Error sending Telegram message:", err);
    }
};

const telegramService = async (
    decryptedForm,
    decryptedSend,
    parsedData,
    submissionId,
    createdAt
) => {
    const {
        "q1-1": q1_1,
        "q1-2": q1_2,
        "q1-3": q1_3,
        "q1-4": q1_4,
        "q1-5": q1_5,
        "q2-1": q2_1,
        "q2-2": q2_2,
        "q2-3": q2_3,
    } = parsedData;

    if (!decryptedForm || !decryptedSend) {
        console.error("❌ Decryption failed for form or send data.");
        return;
    }

    const senderUsername = decryptedForm.username;
    const receiverUsername = decryptedSend.username;

    const senderTelegramID = await getTelegramIdByUsername(senderUsername);
    const receiverTelegramID = await getTelegramIdByUsername(receiverUsername);

    // console.log("📥 Sender Telegram ID:", senderTelegramID);
    // console.log("📥 Receiver Telegram ID:", receiverTelegramID);

    const messageData = {
        q1_1,
        q1_2,
        q1_3,
        q1_4,
        q1_5,
        q2_1,
        q2_2,
        q2_3,
    };

    // Handle expired form
    if (decryptedForm.error === "expired") {
        console.log("❌ Link expired.");

        const senderMsg = buildSenderErrorMessage(
            receiverUsername,
            messageData,
            "لینک منقضی شده است. لطفاً لینک جدید بسازید و دوباره فرم را پر کنید."
        );

        await sendTelegramMessage(senderTelegramID, senderMsg);
        return;
    }

    if (decryptedForm.error || decryptedSend.error) {
        console.error("❌ Decryption error in form or send data.");
        return;
    }

    // Send message to sender
    const senderMsg = buildSenderSuccessMessage(
        receiverUsername,
        messageData,
    );
    await sendTelegramMessage(senderTelegramID, senderMsg);

    // Send message to receiver
    const receiverMsg = buildReceiverMessage(
        senderUsername,
        messageData,
    );
    await sendTelegramMessage(receiverTelegramID, receiverMsg);

    // Log to admin Group
    const adminMessage = buildAdminLogMessage(
        senderUsername,
        receiverUsername,
        messageData,
        submissionId,
    );
    await sendTelegramMessage(process.env.ADMIN_CHAT_ID, adminMessage);
};

module.exports = {
    telegramService,
};
