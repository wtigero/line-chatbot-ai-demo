/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const {onRequest} = require("firebase-functions/v2/https");
const line = require("./utils/line");
const gpt = require("./utils/gpt");
const gemini = require("./utils/gemini");
const NodeCache = require("node-cache");
const cache = new NodeCache();
const CACHE_IMAGE_KEY = "image_";
const CACHE_CHAT_KEY = "chat_";

exports.webhook = onRequest({region: "asia-northeast1"}, async (req, res) => {
  const events = req.body.events;
  events.forEach((event) => processEvent(event));
  res.send(req.method);
});

async function processEvent(event) {
  const userId = event.source.userId;
  switch (event.type) {
    case "message":
      await handleMessageEvent(event, userId);
      break;
    case "follow":
      await handleFollowEvent(userId, event.replyToken);
      break;
    case "unfollow":
      await handleUnfollowEvent(userId);
      break;
    default:
      console.log("Received an unknown event type:", event.type);
      break;
  }
}

async function handleMessageEvent(event, userId) {
  const {type, text} = event.message;
  if (type === "text") {
    await processTextMessage(text, userId, event.replyToken);
  } else if (type === "image") {
    await processImageMessage(event.message.id, userId, event.replyToken);
  }
}

async function processTextMessage(text, userId, replyToken) {
  const payload = {type: "text", text: "Your request could not be processed."}; // Default fallback payload

  try {
    if (text.includes("Image")) {
      payload.text = await handleImageRequest(text, userId);
    } else if (text.includes("Gpt")) {
      payload.text = await handleGptRequest(text);
    } else if (text.includes("Gem")) {
      payload.text = await handleGeminiRequest(text, userId);
    } else if (text.includes("GemContext")) {
      payload.text = await handleGeminiContextRequest(text);
    }
  } catch (error) {
    console.error("Error processing text message:", error);
    payload.text = "An error occurred while processing your request.";
  }

  await line.reply(replyToken, payload);
}

async function handleImageRequest(text, userId) {
  const imagePrompt = text.split(":")[1];
  const response = await gpt.openaiImageRequest(imagePrompt);
  return {
    type: "image",
    originalContentUrl: response,
    previewImageUrl: response,
  };
}

async function handleGptRequest(text) {
  const textPrompt = text.split(":")[1];
  console.log(`openaiText`);
  return await gpt.openaiTextRequest(textPrompt);
}

async function handleGeminiRequest(text, userId) {
  const textPrompt = text.split(":")[1];
  const cacheImage = cache.get(CACHE_IMAGE_KEY + userId);
  if (cacheImage) {
    console.log("Handling multimodal request.");
    return await gemini.multimodal(textPrompt, cacheImage);
  }

  console.log("Handling text-based chat request.");
  const cacheChat = cache.get(CACHE_CHAT_KEY + userId) || [];
  const response = await gemini.chat(cacheChat, textPrompt);
  cacheChat.push({role: "user", parts: [{text: textPrompt}]});
  cacheChat.push({role: "model", parts: [{text: response}]});
  cache.set(CACHE_CHAT_KEY + userId, cacheChat, 60);

  return response;
}


async function handleGeminiContextRequest(text) {
  const textPrompt = text.split(":")[1];
  return await gemini.textOnlyWithContext(textPrompt);
}

async function processImageMessage(messageId, userId, replyToken) {
  const imageBinary = await line.getImageBinary(messageId);
  const imageBase64 = Buffer.from(imageBinary, "binary").toString("base64");
  cache.set(CACHE_IMAGE_KEY + userId, imageBase64, 60);
  await line.reply(replyToken, {
    type: "text",
    text: "ระบุสิ่งที่ต้องการทราบจากภาพได้เลยนะจ้ะ Gemini จะตอบให้เองจ้า",
  });
}
async function handleFollowEvent(userId, replyToken) {
  // User has followed the bot, possibly send a welcome message or log the event
  const welcomeMessage = {
    type: "text",
    text: "Welcome! Thank you for following. How can I assist you today?",
  };
  await line.reply(replyToken, welcomeMessage);
}
async function handleUnfollowEvent(userId) {
  console.log(`User ${userId} has unfollowed.`);
}
