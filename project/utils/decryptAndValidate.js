const encryptionKey = process.env.ENCRYPTION_KEY;
const specialFN = process.env.USERNAME_SPECIAL_FN;
const CryptoJS = require("crypto-js");

function decryptAndValidate(encryptedText, isSend) {
    try {
        console.log("Encrypted text: ", encryptedText);

        const bytes = CryptoJS.AES.decrypt(encryptedText, encryptionKey);
        const string = bytes.toString(CryptoJS.enc.Utf8);

        const stringFunction = eval(specialFN);
        const original = stringFunction(string);
        console.log("Decrypted string: ", original);

        if (isSend) {
            return { username: original };
        }

        const [username, shortDate] = original.split(":");
        if (!username || !shortDate) return { error: "invalid_format" };

        const year = "20" + shortDate.slice(0, 2);
        const month = shortDate.slice(2, 4);
        const day = shortDate.slice(4, 6);

        const linkDate = new Date(`${year}-${month}-${day}`);
        const today = new Date();
        const diffInDays = Math.floor(
            (today - linkDate) / (1000 * 60 * 60 * 24)
        );

        console.log("Difference in days: ", diffInDays);

        if (diffInDays > 7) return { error: "expired", username: username };

        return { username };
    } catch (error) {
        console.error("❌ Error in decryptAndValidate:", error);
        return { error: "decrypt_failed", username: username };
    }
}

module.exports = decryptAndValidate;
