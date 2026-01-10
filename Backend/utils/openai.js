import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
  //Hey OpenAI, I'm sending you a POST request with JSON data,Here's my API key, here's the model I want, and here's the user message.
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, //This sends your API Key.
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    }),
  };

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    // console.log(data.choices[0].message.content); //reply from openAI
    return data.choices[0].message.content; //reply from openAI
  } catch (error) {
    console.error("OpenAI Error:", error);
    throw error;
  }
};

export default getOpenAIAPIResponse;
