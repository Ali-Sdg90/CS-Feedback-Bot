const questions = require("../questions");

const buildReceiverMessage = (senderUsername, data) => {
    return `
<b>🟢 بازخورد جدید دریافت کردید!</b>

👤 <b>فرستنده:</b> @${senderUsername || "نامشخص"}

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

#بازخورد_دریافت_شده
`.trim();
};

module.exports = buildReceiverMessage;
