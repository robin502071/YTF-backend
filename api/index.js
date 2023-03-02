const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(cors());
const { Configuration, OpenAIApi } = require("openai");

app.use(express.json());
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});

const openAI = new OpenAIApi(configuration);

app.get("/api", async (req, res) => {
  const prompt = req.query.prompt;
  if (!prompt) {
    return res
      .status(400)
      .json({ status: "error", errorMessage: "未輸入文字" });
  }
  if (prompt.length > 100) {
    return res
      .status(400)
      .json({ status: "error", errorMessage: "輸入文字過長" });
  }

  const completion = await openAI.createCompletion({
    model: "text-davinci-003",
    prompt: `請假設你是我最好的朋友，我因為心情不好，向你說了以下這段文字：
    ${prompt}
    請你依上述文字，鼓勵我，告訴我我很棒，並希望能運用到顏文字，如₍ᐢ •͈ ༝ •͈ ᐢ₎♡，並且包含一句世界名人的名言佳句，口吻請使用：就像 xxx 說的，至少 70 個字。`,
    max_tokens: 500,
    temperature: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
  });

  const AIResponse = completion.data.choices[0].text;
  return res.status(200).json({
    status: "success",
    AIResponse,
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
module.exports = app;
