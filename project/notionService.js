const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

async function saveToNotion({ name, score }) {
    try {
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                Name: {
                    title: [{ text: { content: name } }],
                },
                Score: {
                    number: score,
                },
            },
        });

        console.log("✅ ذخیره در Notion موفقیت‌آمیز بود:", response.id);
    } catch (error) {
        console.error("❌ خطا در ذخیره به Notion:", error);
    }
}

module.exports = { saveToNotion };
