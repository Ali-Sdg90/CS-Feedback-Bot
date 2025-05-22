require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const { calculateScore } = require("./calculateScore");
const { saveToNotion } = require("./notionService");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT;

app.post("/webhook/tally", async (req, res) => {
    try {
        const formData = req.body;

        console.log("📥 Form data received: ", formData);
        console.log("📥 Form fields: ", formData.data.fields);

        const name = formData.name || "No Name";
        // const score = calculateScore(formData);

        await saveToNotion({ name, score: 12 });

        res.status(200).send("✅ Data received and processed.");
    } catch (error) {
        console.error("❌ Error while processing:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/", (req, res) => {
    res.send("📡 Webhook server is running.");
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
