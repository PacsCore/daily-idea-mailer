import "dotenv/config";
import { readFileSync, writeFileSync } from "fs";

async function fetchDevToArticle() {
    const response = await fetch("https://dev.to/api/articles?tag=javascript&top=7");
    const articles = await response.json();
    return articles.map((a) => `- ${a.title}`).join('\n');
}

function loadHistory() {
    const raw = readFileSync('history.json', 'utf8');
    return JSON.parse(raw);
}

function saveToHistory(idea) {
    const history = loadHistory();
    history.push({ date: new Date().toISOString().split('T')[0], idea });
    writeFileSync('history.json', JSON.stringify(history, null, 2));
}

async function generateIdea() {
    const articleTitles = await fetchDevToArticle();
    const history = loadHistory();
    const pastIdeas = history.map((h) => `- ${h.idea}`).join('\n') || "(none yet)";

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
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );

  const data = await response.json();
  if (!data.candidates) {
    throw new Error("Gemini did not return a valid idea: " + JSON.stringify(data));
  }
  return data.candidates[0].content.parts[0].text;
}

function parseIdea(rawText) {
    const get = (label) => {
        const regex = new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n[A-Z]+:|$)`);
        return rawText.match(regex)?.[1]?.trim() ?? "";
      };

      return {
        idea: get("IDEA"),
        description: get("DESCRIPTION"),
        tech: get("TECH"),
        cheatsheet: get("CHEATSHEET"),
        resource: get("RESOURCE"),
      };
}

function buildEmailHtml(parts) {
    return `
      <h2>${parts.idea}</h2>
      <p>${parts.description}</p>
      <p><strong>Tech:</strong> ${parts.tech}</p>
      <p><strong>Cheatsheet:</strong></p>
      <pre>${parts.cheatsheet}</pre>
      <p><strong>Resource:</strong> ${parts.resource}</p>
    `;
  }
  
  async function sendEmail(parts) {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "Daily Idea Mailer", email: "enriquecore.dev@gmail.com" },
        to: [{ email: "achacoso.enrique@protonmail.com", name: "Enrique" }],
        subject: `Today's coding idea: ${parts.idea}`,
        htmlContent: buildEmailHtml(parts),
      }),
    });
  
    const data = await response.json();
    if (!data.messageId) {
      throw new Error("Brevo did not confirm the email: " + JSON.stringify(data));
    }
    return data;
  }
  
  async function run() {
    try {
      console.log("Generating idea...");
      const rawText = await generateIdea();
  
      console.log("Parsing idea...");
      const parts = parseIdea(rawText);
  
      console.log("Sending email...");
      await sendEmail(parts);
  
      console.log("Saving to history...");
      saveToHistory(parts.idea);
  
      console.log("Done! Idea sent:", parts.idea);
    } catch (error) {
      console.error("Run failed:", error.message);
    }
  }
  
  run();