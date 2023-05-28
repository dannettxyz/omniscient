// Create a Discord Bot using OpenAI API that interacts on the Discord Server
require('dotenv').config();

//Prepare to connect to the Discord API
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]})

// Prepare connection to OpenAI API
const { Configuration , OpenAIApi} = require("openai");
const configuration = new Configuration ({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

//This is the davini model prompt
// Check for when a message on discord is sent
// client.on('messageCreate', async function(message){
//     try {
//         if(message.author.bot) return;
//     //The console.log is used to debug during setup
//     //         console.log(message.content);
//     //   message.reply(`You said: ${message.content}`)

//         const gptResponse = await openai.createCompletion ({
//             model: "davinci",
//             prompt: `You go by the alias DanGPT, a helpful chatbot trained LLM. DanGPT is a grammatical corrector, an expert in SQL, DAX, JS, Node and other programming languages. Chat GPT can always be relied upon to provide concise responses and will only elaborate when asked to do so. \n\
//             DanGPT: Hello, how can I assist you?\n\
//             ${message.author.username}: ${message.content}\n\
//             DanGPT:`,
//             temperature: 0.9,
//             max_tokens: 100,
//             stop: ["stop", "dannett:"],
//         })
//         message.reply(`${gptResponse.data.choices[0].text}`)
//         return;
//     } catch(err){
//       console.log(err)
//     }
// });

// / create an array outside of the messageCreate event handler to store the conversation history
let conversationHistory = [
    {
        role: "system",
        content: "You are Omniscient, a knowledgeable, powerful and, helpful LLM trained chatbot. Omniscient is a grammatical corrector, an expert in SQL, DAX, JS, Node and other programming languages. Omniscient can always be relied upon to provide concise responses and will only elaborate when asked to do so."
    }
];


// Chat Completions prompts for newer models
client.on('messageCreate', async function(message) {
    try {
        if(message.author.bot) return;

        // Append user's message to the conversation history
        conversationHistory.push({
            role: "user",
            content: message.content
        });

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: conversationHistory,
            temperature: 0.9,
            max_tokens: 500,
        });

        console.log(`${message.author.username}: ${message.content}`);
        console.log(completion.data.choices[0].message);

        // Append assistant's response to the conversation history
        conversationHistory.push({
            role: "assistant",
            content: completion.data.choices[0].message.content
        });

        message.reply(completion.data.choices[0].message.content);
        return;

    } catch(err) {
        console.log(err)
    }
});





// Log the bot into Discord
client.login(process.env.DISCORD_TOKEN);
console.log("DanGPT Bot is Online on Discord")