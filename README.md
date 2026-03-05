# 🐊 Gator CLI

Gator is a command-line RSS feed aggregator built with **TypeScript**, **Node.js**, and **PostgreSQL**.  
It allows users to register, follow RSS feeds, and manage their subscriptions directly from the terminal.

---

## 🚀 Features

- User registration & login
- Add RSS feeds
- Follow / unfollow feeds
- View followed feeds
- Fetch and parse RSS feeds from the internet
- PostgreSQL database integration using Drizzle ORM

---

## 📋 Requirements

Before running the project, make sure you have installed:

- Node.js (v18 or newer)
- npm
- PostgreSQL
- Git

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/YOUR-USERNAME/gator-cli.git
cd gator-cli
---
Install dependencies:
npm install
## 🔧 Config File Setup

Create a config file in your home directory:
~/.gatorconfig.json
Add the following content:

```json
{
  "dbUrl": "YOUR_DATABASE_URL",
  "currentUserName": ""
}
Run commands using:npm run start <command>
Example:npm run start register dania

💻 Example Commands
Register a user
npm run start register <username>
Login
npm run start login <username>
Add a feed
npm run start addfeed "Feed Name" "Feed URL"
Followed feeds
npm run start following
Unfollow a feed
npm run start unfollow <feed_url>
Reset database
npm run start reset

---

