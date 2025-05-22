const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

async function saveToNotion(parsedData) {
    const {
        form,
        mentorField: mentorField,
        "q1-1": q1_1,
        "q1-2": q1_2,
        "q1-3": q1_3,
        "q1-4": q1_4,
        "q1-5": q1_5,
        "q2-1": q2_1,
        "q2-2": q2_2,
        "q2-3": q2_3,
    } = parsedData;

    const mentorId = mentorField?.value?.[0];
    const mentorOption = mentorField?.options?.find(
        (opt) => opt.id === mentorId
    );
    const mentorName = mentorOption?.text || "ناشناخته";

    console.log("Mentor Field: ", mentorField);
    console.log("Mentor ID: ", mentorId);
    console.log("Mentor Option: ", mentorOption);
    console.log("Mentor Name: ", mentorName);

    const score =
        (Number(q1_1) +
            Number(q1_2) +
            Number(q1_3) +
            Number(q1_4) +
            Number(q1_5)) /
        5;

    await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
            sender: { rich_text: [{ text: { content: form } }] },
            reciver: { rich_text: [{ text: { content: mentorName } }] },
            "q1-1": { number: Number(q1_1) },
            "q1-2": { number: Number(q1_2) },
            "q1-3": { number: Number(q1_3) },
            "q1-4": { number: Number(q1_4) },
            "q1-5": { number: Number(q1_5) },
            "q2-1": { rich_text: [{ text: { content: q2_1 } }] },
            "q2-2": { rich_text: [{ text: { content: q2_2 } }] },
            "q2-3": { rich_text: [{ text: { content: q2_3 } }] },
            score: { number: score },
        },
    });
}

module.exports = { saveToNotion };
