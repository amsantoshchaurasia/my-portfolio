import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is missing in .env");
  process.exit(1);
}

console.log("✅ Gemini API key loaded.");

app.post("/api/chat", async (req, res) => {
  try {
    const { model, question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: "Question is required.",
      });
    }

    const selectedModel = model || "gemini-3.7-flash";

    console.log(
      `Sending Gemini request using ${selectedModel}...`
    );

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        selectedModel
      )}:generateContent`;

    const response = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },

      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: question,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(
        `Gemini API error from ${selectedModel}:`,
        data
      );

      return res.status(response.status).json({
        success: false,
        error:
          data?.error?.message ||
          "Gemini API request failed.",
      });
    }

    const responseText =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text || "")
        .join("")
        .trim() || "";

    if (!responseText) {
      console.warn(
        `${selectedModel} returned an empty response.`
      );

      return res.status(500).json({
        success: false,
        error: "Gemini returned an empty response.",
      });
    }

    console.log(
      `✅ Gemini response received from ${selectedModel}.`
    );

    return res.json({
      success: true,
      response: responseText,
      model: selectedModel,
    });
  } catch (error) {
    console.error("❌ Gemini backend error:", error);

    return res.status(500).json({
      success: false,
      error:
        error?.message ||
        "Unable to generate AI response.",
    });
  }
});

app.get("/api/health", (req, res) => {
  return res.json({
    success: true,
    message: "Santosh AI backend is running.",
  });
});

app.listen(PORT, () => {
  console.log(
    `🚀 Santosh AI backend running on http://localhost:${PORT}`
  );
});