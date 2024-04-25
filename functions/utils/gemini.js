/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const {GoogleGenerativeAI} = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI_API_KEY);
const context = require("./context");

class Gemini {
  async textOnly(prompt) {
    const model = genAI.getGenerativeModel({model: "gemini-pro"});
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  async textOnlyWithContext(prompt) {
    const model = genAI.getGenerativeModel({model: "gemini-pro"});
    const parts = [{
      text: "ตอบคำถามโดยอ้างอิงข้อมูลนี้เท่านั้น\n" + JSON.stringify(context.lct23_json),
    }];
    const result = await model.generateContent([prompt, ...parts]);
    return result.response.text();
  }

  async multimodal(prompt, base64Image) {
    const model = genAI.getGenerativeModel({model: "gemini-pro-vision"});
    const mimeType = "image/png";
    const imageParts = [{
      inlineData: {data: base64Image, mimeType},
    }];
    const result = await model.generateContent([prompt, ...imageParts]);
    return result.response.text();
  }

  async chat(cacheChatHistory, prompt) {
    const model = genAI.getGenerativeModel({model: "gemini-pro"});
    const chatHistory = cacheChatHistory || [];

    // Ensure that the chat history is formatted correctly, each entry should be like:
    // { role: "user", parts: [{text: "User's question"}] }
    // { role: "model", parts: [{text: "Model's response"}] }

    // Start a chat session with the existing history
    const chat = model.startChat({history: chatHistory});

    // Structure the new message correctly before sending
    const newMessage = [{text: prompt}];
    // Send the structured message
    const result = await chat.sendMessage(newMessage);
    return result.response.text();
  }
}

module.exports = new Gemini();
