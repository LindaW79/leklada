const fetch = require("node-fetch");

exports.handler = async function(event) {
  console.log("🟡 Funktion anropad");

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    console.error("❌ Ingen API-nyckel hittades");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API-nyckel saknas" })
    };
  }

  const body = JSON.parse(event.body);
  const prompt = body.message || "Ge mig ett utmanande AI-uppdrag.";
  console.log("🟢 Prompt:", prompt);

  try {
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
    console.log("✅ Svar från OpenAI:", data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: data.choices[0].message.content })
    };
  } catch (error) {
    console.error("❌ Fel vid anrop till OpenAI:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Kunde inte hämta uppdrag från OpenAI." })
    };
  }
};
