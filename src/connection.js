const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootpass',
    database: 'wiserp'
});

connection.connect((err) => {
    console.log(err ? 'Erro na conexão mysql' : 'Conectado MYSQL com sucesso')});

module.exports = connection;