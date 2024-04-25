/* eslint-disable require-jsdoc */
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: `${process.env.OPEN_AI_API_KEY}`,
});
class GPT {
  async openaiTextRequest(message) {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });
    console.log(JSON.stringify(completion));
    return completion.choices[0].message.content;
  }

  async openaiImageRequest(message) {
    const image = await openai.images.generate({
      model: "dall-e-3",
      prompt: message,
    });
    console.log(JSON.stringify(image));
    return image.data[0].url;
  }
}
module.exports = new GPT();
