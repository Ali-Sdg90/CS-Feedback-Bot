const questions = require("../questions");

const buildSenderErrorMessage = (
    receiverUsername,
    data,
    reason = "ارسال ناموفق"
) => {
    return `
<b>❌ ارسال بازخورد ناموفق بود.</b>
<b>علت:</b> ${reason}

📨 <b>گیرنده موردنظر:</b> @${receiverUsername || "نامشخص"}

📊 <b>ارزیابی عددی:</b>

<b>${questions.q1_1}</b>  
⭐️ ${data.q1_1}

<b>${questions.q1_2}</b>  
⭐️ ${data.q1_2}

<b>${questions.q1_3}</b>  
⭐️ ${data.q1_3}

<b>${questions.q1_4}</b>  
⭐️ ${data.q1_4}

<b>${questions.q1_5}</b>  
⭐️ ${data.q1_5}

📝 <b>پاسخ‌های تشریحی:</b>

<b>${questions.q2_1}</b>  
🗒️ ${data.q2_1 || "پاسخی ثبت نشده"}

<b>${questions.q2_2}</b>  
🗒️ ${data.q2_2 || "پاسخی ثبت نشده"}

<b>${questions.q2_3}</b>  
🗒️ ${data.q2_3 || "پاسخی ثبت نشده"}

#بازخورد_ارسال_ناموفق
`.trim();
};

module.exports = buildSenderErrorMessage;
