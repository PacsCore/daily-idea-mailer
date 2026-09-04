import "dotenv/config";

async function sendTestEmail() {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", "api-key": process.env.BREVO_API_KEY },
      
    body: JSON.stringify({
        sender: {
            name: "Daily Idea Mailer",
            email: "enriquecore.dev@gmail.com"
        },
        to: [
            {
                email: "achacoso.enrique@protonmail.com",
                name: "Enrique A."
            },
        ],
        subject: "Test email from Daily Idea Mailer",
        htmlContent: "<p>If you're reading this, the Brevo connection works!</p>"
    })
  });


  const data = await response.json()
  console.log(data);
}

sendTestEmail();