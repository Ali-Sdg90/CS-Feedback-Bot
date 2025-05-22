require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const { saveToNotion } = require("./notionService");
const { parseFormFields } = require("./utils/parseFormFields");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT;

app.post("/webhook/tally", async (req, res) => {
    try {
        const formFields = req.body.data?.fields || [];

        console.log("📥 Form fields: ", formFields);

        const parsedData = parseFormFields(formFields);

        await saveToNotion(parsedData);

        res.status(200).send("✅ Data saved to Notion.");
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/", (req, res) => {
    res.send("📡 Webhook server is running.");
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

// npx ngrok http 3000
