/* eslint-disable require-jsdoc */
const axios = require("axios");

const LINE_HEADER = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
};

class LINE {
  async getImageBinary(messageId) {
    const originalImage = await axios({
      method: "get",
      headers: LINE_HEADER,
      url: `https://api-data.line.me/v2/bot/message/${messageId}/content`,
      responseType: "arraybuffer",
    });
    return originalImage.data;
  }

  reply(replyToken, payload) {
    return axios({
      method: "post",
      url: "https://api.line.me/v2/bot/message/reply",
      headers: LINE_HEADER,
      data: JSON.stringify({
        replyToken: replyToken,
        messages: [payload],
      }),
    });
  }
}

module.exports = new LINE();
