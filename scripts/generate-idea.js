import "dotenv/config";

async function generateIdea() {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: "Say hello and confirm you're working, in one short sentence." }],
          },
        ],
      }),
    }
  );

  const data = await response.json();
  console.log(data.candidates[0].content.parts[0].text);
}

generateIdea();