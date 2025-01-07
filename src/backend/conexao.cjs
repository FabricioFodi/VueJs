const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tarefas'
});

conexao.connect((erro) => {
    if (erro) {
        return console.log('Erro ao conectar ao banco de dados', erro);
    }
    console.log('Conectado ao banco de dados');
});

module.exports = { conexao };