# 💘 SOUL CONNECTION

## Description

**Soul Connection** (Epitech project *Survivor*) is a third-year web project designed as a **roleplay between a client and a team of developers**: the client, a **dating-coach agency**, expresses its needs and the team builds the website accordingly.

The result is an **internal dashboard** for the agency's coaches and managers to follow their customers, plan events, share tips and track statistics.

The backend regularly **synchronises its database with the client's API**, so the dashboard always shows up-to-date data.

---

## 🧩 Features

- 🔐 **Login** for employees
- 🏠 **Home** dashboard
- 👥 **Customers**: list, profile and payment history
- 🧑‍🏫 **Coaches**: list and creation
- 📅 **Events**: list and **map** with event locations
- 💡 **Tips** for coaches
- 📊 **Statistics** with charts
- ❤️ **Astrological compatibility** between two customers (by sign)
- 👗 **Clothes**: build an outfit (hat, top, bottom, shoes) for a customer
- 🔄 **Automatic sync** with the client's API every **2 hours** (cron)

---

## 🛠️ Tech Stack

| Part | Technologies |
|------|--------------|
| **Frontend** | React, React Router, Chart.js, Pigeon Maps, Axios |
| **Backend** | Node.js, Express, node-cron, Axios |
| **Database** | PostgreSQL (Docker) |

```
├── client/   # React application
└── server/   # Express API + cron + database
```

---

## ⬇️ Installation

Install packages (in `client/` **and** `server/`):

```bash
npm i
```

Create a `.env` file in `server/` with the database and API credentials:

```env
PORT=
PG_HOST=
PG_PORT=
PG_USER=
PG_PASSWORD=
PG_DATABASE=
MAIL_TOKEN=
PWD_TOKEN=
API_KEY_VALUE=
```

---

## 💡 Usage

### Database

From the `server/` folder:

```bash
sudo docker-compose up -d     # start the database
sudo docker-compose down      # stop the database
sudo rm -rf ./postgres-data   # reset the database
```

### Run

```bash
npm start          # in client/ or server/
npm run script     # in client/: start both at the same time
```

Then open **[http://localhost:3000](http://localhost:3000)**.

---

## 🫂 Team

- Ryan Hercule ([LinkedIn](https://www.linkedin.com/in/ryan-hercule/))
- Jean-Garice Denoncin ([LinkedIn](https://www.linkedin.com/in/jean-garice-denoncin/))
- Tristan Darodes-de-Tailly ([LinkedIn](https://www.linkedin.com/in/tristan-darodes-de-tailly-677aa0239/))
- Tristan Leturgie ([LinkedIn](https://www.linkedin.com/in/tristanleturgie/))
