# Daily Coding Idea Mailer

A small automated system that sends you **one coding project idea every day** by
email — with helpful links, a mini cheatsheet, and example code you could use.
The goal: you don't have to search for project ideas yourself anymore.

Everything in this project is designed to stay **100% free**.

---

## How it works (simple version)

```
1. A timer runs once a day (GitHub Actions)
        │
2. It collects fresh coding content (dev.to, Hacker News, GitHub Trending)
        │
3. An AI (Google Gemini, free) turns that into one clear project idea
   + a short cheatsheet + useful links
        │
4. The idea gets saved in a file (so it's never repeated)
        │
5. The idea gets emailed to you (Brevo, free) — works with any email, including ProtonMail
```

## Tools used (and why they're free)

| Part | Tool | Why it stays free |
|---|---|---|
| Finding content | dev.to API, Hacker News API, GitHub API | No login needed, no way to be charged |
| Writing the idea | Google Gemini API (Flash model) | No payment method linked → it can never bill you, it just stops working if the limit is hit |
| Remembering past ideas | A simple `history.json` file in the repo | Free, just a text file |
| Sending the email | Brevo | Free plan, no credit card needed |
| Running it daily | GitHub Actions (a free scheduler) | Free for public repos |

**How often:** One email per day, with one idea. Kept simple on purpose.

---

## Step-by-step plan

We'll build this in small pieces. Each step is small enough to finish in one
sitting, and each one gives you something to commit to GitHub.

### Step 1 — Set up the repo
- Create a new repo (e.g. `daily-coding-mailer`)
- Add a `README.md` and a `config.json` file for your preferences (languages, topics, skill level)
- First commit

### Step 2 — Test the "finding content" part alone
- A small script that just calls the dev.to (or Hacker News) API and prints the raw results
- No AI yet, no email yet — just check: does this data look useful?

### Step 3 — Connect Google Gemini
- Create a Google Cloud project — **do not turn on billing**
- Save the API key as a GitHub Secret
- Extend the script: raw content → prompt → one generated idea, printed to the screen (not emailed yet)

### Step 4 — Add the history file
- Decide what to store (date, title, short description)
- Before creating a new idea, check it's not too similar to a past one
- Update the file after every run

### Step 5 — Connect Brevo (email sending)
- Create a Brevo account, verify one sender email address
- Save the API key as a GitHub Secret
- Script sends the generated idea to your ProtonMail address

### Step 6 — Put it all together
- One script that runs steps 2–5 in order
- If one step fails (e.g. hits a limit), the script should stop cleanly instead of crashing

### Step 7 — Automate with GitHub Actions
- Add a workflow file that runs once a day
- Add your secrets (Gemini key, Brevo key) in the repo settings
- The workflow saves the updated history file back to the repo

### Step 8 — Test and polish
- Watch a few real runs
- Improve the email format if you like (nicer layout)
- Adjust your preferences in `config.json`

---

## Ideas for later (not now)

- A second email in the evening
- A small dashboard to change your preferences
- A feedback option ("liked it" / "too easy" / "too hard")

---

## Progress

- [x] Step 1 — Repo setup
- [x] Step 2 — Test content source
- [x] Step 3 — Connect Gemini
- [x] Step 4 — Add history file
- [x] Step 5 — Connect Brevo
- [x] Step 6 — Combine everything
- [x] Step 7 — Automate with GitHub Actions
- [ ] Step 8 — Test and polish
