const express = require('express');
const app = express();
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

app.use(cors());
app.use(express.json());
require('dotenv').config();

// Assuming GoogleGenerativeAI is properly configured and instantiated
const genAI = new GoogleGenerativeAI('Gemini API key');

app.post('/gemini', async (req, res) => {
  try {
    console.log(req.body.history);
    console.log(req.body.message);

    // Ensure chat history is in the expected format
    const chatHistory = req.body.history.map(item => ({
      parts: [item.message] // Assuming each item in history contains a 'message' property
    }));

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const chat = model.startChat({
      history: chatHistory
    });

    const msg = req.body.message;
    const result = await chat.sendMessage(msg);
    const responseText = await result.response.text();
    console.log(responseText)
    if (responseText) {
      res.status(200).send(responseText);
    } else {
      res.status(400).json({ success: false, message: 'Empty response from generative model' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

const port = 8000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
