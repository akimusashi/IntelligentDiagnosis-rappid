var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'Black',
    password: '123456',
    port: '3306',
    database: 'db_test'
});

connection.connect();
