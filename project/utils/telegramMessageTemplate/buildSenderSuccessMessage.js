const questions = require("../questions");

const buildSenderSuccessMessage = (receiverUsername, data) => {
    return `
<b>✅ بازخورد شما با موفقیت ارسال شد.</b>

👤 <b>گیرنده:</b> ${receiverUsername ? `@${receiverUsername}` : "نامشخص"}

📊 <b>ارزیابی عددی</b>

<b>${questions.q1_1}</b>  
⭐️ ${data.q1_1}/5

<b>${questions.q1_2}</b>  
⭐️ ${data.q1_2}/5

<b>${questions.q1_3}</b>  
⭐️ ${data.q1_3}/5

<b>${questions.q1_4}</b>  
⭐️ ${data.q1_4}/5

<b>${questions.q1_5}</b>  
⭐️ ${data.q1_5}/5

📝 <b>پاسخ‌های تشریحی</b>

<b>${questions.q2_1}</b>  
🗒️ ${data.q2_1?.trim() || "— پاسخی ثبت نشده —"}

<b>${questions.q2_2}</b>  
🗒️ ${data.q2_2?.trim() || "— پاسخی ثبت نشده —"}

<b>${questions.q2_3}</b>  
🗒️ ${data.q2_3?.trim() || "— پاسخی ثبت نشده —"}

#بازخورد_ارسال_شده
`.trim();
};

module.exports = buildSenderSuccessMessage;
