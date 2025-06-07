const dayjs = require("dayjs");
require("dayjs/locale/fa");
dayjs.locale("fa");

const buildAdminLogMessage = (
    senderUsername,
    receiverUsername,
    data,
    sessionId,
    createdAt
) => {
    const dateTime = dayjs(createdAt).format("dddd، D MMMM YYYY - HH:mm");

    let statusIcon = "";
    let statusTag = "";

    const score =
        (data.q1_1 + data.q1_2 + data.q1_3 + data.q1_4 + data.q1_5) / 5;

    if (score >= 4.25) {
        statusIcon = "🟢";
        statusTag = "#وضعیت_عالی";
    } else if (score >= 3.25) {
        statusIcon = "🟡";
        statusTag = "#وضعیت_متوسط";
    } else {
        statusIcon = "🔴";
        statusTag = "#وضعیت_ضعیف";
    }

    const hasWrittenAnswers = [data.q2_1, data.q2_2, data.q2_3].some(
        (answer) => answer && answer.trim()
    );

    const notionLink =
        "https://www.notion.so/1f5e2bea4c5680be8748e9ffa029a8de?v=1f5e2bea4c56809298df000c66dcdca0";

    const writtenAnswersText = hasWrittenAnswers
        ? `📝 <b>پاسخ تشریحی ثبت شده است.</b>
سوال اول: ${data.q2_1?.trim() || "— پاسخی ثبت نشده —"}
سوال دوم: ${data.q2_2?.trim() || "— پاسخی ثبت نشده —"}
سوال سوم: ${data.q2_3?.trim() || "— پاسخی ثبت نشده —"}`
        : "";

    return [
        `<b>📥 ثبت بازخورد جدید</b>`,
        ``,
        `👤 <b>فرستنده:</b> ${
            senderUsername ? `@${senderUsername}` : "نامشخص"
        }`,
        `👥 <b>گیرنده:</b> ${
            receiverUsername ? `@${receiverUsername}` : "نامشخص"
        }`,
        ``,
        `<b>تاریخ و زمان:</b> ${dateTime}`,
        `<b>آیدی بازخورد:</b> <code>${sessionId}</code>`,
        ``,
        `<b>میانگین امتیاز:</b> <b>${score.toFixed(2)}</b> ${statusIcon}`,
        hasWrittenAnswers ? `` : null,
        hasWrittenAnswers ? writtenAnswersText : null,
        ``,
        `🔗 <a href="${notionLink}">مشاهده در دیتابیس</a>`,
        ``,
        `#لاگ_بازخورد`,
        `${statusTag}`,
    ]
        .filter((line) => line !== null)
        .join("\n");
};

module.exports = buildAdminLogMessage;
