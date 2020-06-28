const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const port = process.env.PORT || 8080;

const dbKey = require('./keys/db-key.json');
const connection = mysql.createConnection({
    host: dbKey.dbhost,
    user: dbKey.dbuser,
    password: dbKey.dbpasswd,
    database: dbKey.dbname
});
connection.connect();
connection.queryAsync = query => new Promise((resolve, reject) => {
    connection.query(query, (err, results, fields) => {
        if (err)
            reject(err);
        resolve({ results, fields });
    })
});

const mchat = require('./route/mchat-route')(connection);
const app = express();

app.use(cors({ origin: '*' }));
app.use('/mchat', mchat);

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
