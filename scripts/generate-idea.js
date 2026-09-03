import "dotenv/config";
import { readFileSync, writeFileSync } from "fs";

async function fetchDevToArticles() {
  const response = await fetch("https://dev.to/api/articles?tag=javascript&top=7");
  const articles = await response.json();
  return articles.map((a) => `- ${a.title}`).join("\n");
}

function loadHistory() {
  const raw = readFileSync("history.json", "utf-8");
  return JSON.parse(raw);
}

function saveToHistory(idea) {
  const history = loadHistory();
  history.push({
    date: new Date().toISOString().split("T")[0],
    idea,
  });
  writeFileSync("history.json", JSON.stringify(history, null, 2));
}

async function generateIdea() {
  const articleTitles = await fetchDevToArticles();
  const history = loadHistory();
  const pastIdeas = history.map((h) => `- ${h.idea}`).join("\n") || "(none yet)";

  const prompt = `Here are some trending coding article titles from today:
${articleTitles}

Here are project ideas already suggested before — do NOT repeat these or suggest something too similar:
${pastIdeas}

Based on the trends, suggest ONE beginner-to-intermediate coding project idea.
Format your response exactly like this:

IDEA: (short project name)
DESCRIPTION: (2-3 sentences on what to build)
TECH: (suggested languages/tools)
CHEATSHEET: (3-5 short bullet points of key concepts needed)
RESOURCE: (one real, well-known resource, like MDN or a language's official docs, no invented links)`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await response.json();
  const resultText = data.candidates[0].content.parts[0].text;
  console.log(resultText);

  const ideaTitle = resultText.match(/IDEA:\s*(.+)/)?.[1] ?? "Untitled";
  saveToHistory(ideaTitle);
}

generateIdea().catch(console.error);