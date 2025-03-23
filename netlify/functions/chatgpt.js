const fetch = require("node-fetch");

exports.handler = async function(event) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  const body = JSON.parse(event.body);
  const prompt = body.message || "Ge mig ett utmanande AI-uppdrag.";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      max_tokens: 100
    })
  });

  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify({ message: data.choices[0].message.content })
  };
};