const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("@notionhq/client");

const app = express();
app.use(bodyParser.json());

const notion = new Client({ auth: "YOUR_NOTION_API_KEY" });
const databaseId = "YOUR_NOTION_DATABASE_ID";

app.post("/webhook/tally", async (req, res) => {
    const data = req.body;
    console.log("اطلاعات دریافتی از Tally:", data);

    await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
            Name: {
                title: [
                    {
                        text: {
                            content: data.name || "بدون نام",
                        },
                    },
                ],
            },
            Score: {
                number: 12,
            },
        },
    });

    res.status(200).send("OK");
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
