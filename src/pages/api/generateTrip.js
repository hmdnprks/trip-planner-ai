const { Configuration, OpenAIApi } = require('openai');
const { recipePrompt } = require('./prompt.json');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const { destination } = req.body;
  // use try to make a request to the OpenAI completetion api and return the response
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: "user", content: `${recipePrompt}${destination}` }],
      max_tokens: 1000,
      temperature: 0,
      n: 1,
    });
    // return the response to the client
    const response = completion.data.choices[0].message.content;

    return res.status(200).json({
      success: true,
      data: response,
    });
  }
  // use catch to catch any errors and return the error include a message to the user
  catch (error) {
    console.log('error :>> ', error);
    if (error.response.status === 401) {
      return res.status(401).json({
        error: "Please provide a valid API key.",
      });
    }
    return res.status(500).json({
      error: "An error occurred while generating recipe information. Please try again later.",
    });
  }
}

