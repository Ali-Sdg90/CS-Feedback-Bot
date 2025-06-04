const { Client } = require("@notionhq/client");
require("dotenv").config();

const notion = new Client({ auth: process.env.NOTION_API_KEY_USER });

const getTelegramIdByUsername = async (username) => {
    if (!username) {
        console.warn("❌ Username is required");
        return null;
    }

    try {
        const response = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID_USER,
            filter: {
                property: "Username",
                rich_text: {
                    equals: username,
                },
            },
        });

        if (!response.results.length) {
            console.warn(`❌ No user found in Notion with username: ${username}`);
            return null;
        }

        const user = response.results[0];
        const tgId = user.properties["Telegram ID"];

        if (tgId?.type === "number") {
            return tgId.number;
        } else {
            console.warn(`❌ Telegram ID is missing for user: ${username}`);
            return null;
        }

    } catch (error) {
        console.error("❌ Error while querying Notion:", error.message);
        return null;
    }
};

module.exports = getTelegramIdByUsername;
