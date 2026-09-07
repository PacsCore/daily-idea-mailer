# Daily Coding Idea Mailer

A small automated system that sends you **one coding project idea every day** by
email — with helpful links, a mini cheatsheet, and example code you could use.
The goal: you don't have to search for project ideas yourself anymore.

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
