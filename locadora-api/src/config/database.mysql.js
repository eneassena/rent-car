const mysql = require("mysql2/promise");
require("dotenv").config();

console.log("Configurando pool de conexões MySQL...");
console.log(`Host: ${process.env.MYSQL_HOST || "localhost"}`);
console.log(`Port: ${process.env.MYSQL_PORT || 3306}`); 
console.log(`Database: ${process.env.MYSQL_DATABASE}`);

const db = mysql.createPool({
    host: process.env.MYSQL_HOST || "localhost",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    multipleStatements: true,
    dateStrings: true,
    decimalNumbers: true,
});

module.exports = db;
