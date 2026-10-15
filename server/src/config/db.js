// const mysql = require('mysql');
// require('dotenv').config();

// const connection = mysql.createConnection({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_ROOT_PASSWORD,
//   database: process.env.MYSQL_DATABASE
// });

// connection.connect((err) => {
//   if (err) {
//     console.log(`host: ${process.env.MYSQL_HOST},
//     user: ${process.env.MYSQL_USER},
//     password: ${process.env.MYSQL_ROOT_PASSWORD},
//     database: ${process.env.MYSQL_DATABASE}`);
//     console.error('Error connecting to MySQL database:', err);
//     return false;
//   }
//   console.log('Connected to MySQL database.');
//   return true;
// });
const { Client } = require('pg');
require('dotenv').config();

//connect to postgresql db
const connection = new Client({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT
});

connection.connect((err) => {
  if (err) {
    console.log(`host: ${process.env.PG_HOST},
    user: ${process.env.PG_USER},
    password: ${process.env.PG_PASSWORD},
    database: ${process.env.PG_DATABASE},
    port: ${process.env.PG_PORT}`);
    console.error('Error connecting to PostgreSQL database:', err);
    return false;
  }
  console.log('Connected to PostgreSQL database.');
  return true;
});

module.exports = connection;