# Line Chatbot X GPT X Gemini

This repository contains the source code for a LINE chatbot integrated with OpenAI's ChatGPT and Google's Gemini AI, developed as a follow-up project from the course "Building LINE Chatbot with ChatGPT and Gemini" offered by BornToDev.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js and npm
- Firebase CLI
- Access to OpenAI and Gemini APIs

## Getting Started

Follow these steps to set up and run your project locally.

### 1. Clone the Repository

Start by cloning this repository to your local machine:

```bash
git clone https://github.com/yourusername/line-chatbot-ai-demo.git
cd line-chatbot-ai-demo
```

### 2. Firebase Setup
You need to set up Firebase to manage the application's backend services including functions.

Login to Firebase
```bash
firebase login
```
#### Initialize Firebase
Run the following command and select the appropriate options as listed:

```bash
firebase init
```
- Choose Functions: Configure and deploy Cloud Functions
- Select JavaScript for the language
- Choose Yes to use ESLint
- Choose Yes to install dependencies with npm

#### Initialize Emulators
For local testing, set up Firebase emulators:

```bash
firebase init emulators
```
- Select Functions Emulator
- Set the port to 5001 for functions
- Choose Yes to download the emulators if not already installed
- Leave the default empty to use any available port for other services
- Choose Yes to enable the emulator UI
### 3. API Keys
#### OpenAI
Obtain your API Key from OpenAI's platform:

- Visit OpenAI https://platform.openai.com/
- Navigate to API Keys section and generate a new key
- Store this key securely and set it in your environment variables or configuration files
#### Gemini

Similarly, obtain an API Key from Google's Gemini service: 

- Access the Gemini API through the Google Cloud Console https://aistudio.google.com/
- Create an API key for the Gemini project
- Ensure this key is included in your project's environment settings
### 4. Running the Emulators
To start the Firebase emulators and test the functions locally:

```bash
firebase emulators:start
```
You can access the emulator suite UI at localhost:4000.

### Usage
After setting up the environment and running the emulators, you can interact with your chatbot via LINE Messaging API using the provided Webhook URL from Firebase functions.


### License
This project is licensed under the MIT License - see the LICENSE.md file for details.