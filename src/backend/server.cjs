const { conexao } = require('./conexao.cjs');
const { autenticarToken } = require('./middleware.cjs');
const { SECRET_KEY } = require('./chave_secreta.cjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const https = require('https');
const fs = require('fs');

const app = express();

const options = {
    key: fs.readFileSync('../../localhost-key.pem'),
    cert: fs.readFileSync('../../localhost.pem'),
};

app.use(cors({
    origin: 'https://localhost:5174', // URL do frontend
}));
app.use(express.json());

// Servir os arquivos estáticos do Vue (frontend)
app.use(express.static(path.join(__dirname, 'dist')));

//Rota de Cadastro
app.post('/api/cadastro', async (req, res) => {
    try {
        const { usuario, senha } = req.body;

        if (!usuario || !senha) {
            return res.status(400).json({ mensagem: 'Usuário e senha são obrigatórios' });
        }

        // Verificar se o usuário já existe
        const queryVerificar = 'SELECT 1 FROM usuarios WHERE usuario = ?';
        const [usuarios] = await conexao.promise().query(queryVerificar, [usuario]);

        if (usuarios.length > 0) {
            return res.status(400).json({ mensagem: `Usuário já existe. Use outro nome de usuário` });
        }

        // Criptografar a senha e tratar erro
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        // Inserir usuário no banco de dados
        const queryInserir = 'INSERT INTO usuarios (usuario, senha) VALUES (?, ?)';
        await conexao.promise().query(queryInserir, [usuario, senhaCriptografada]);

        return res.status(201).json({ mensagem: `Usuário ${usuario} cadastrado com sucesso` });

    } catch (erro) {
        if (erro.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ mensagem: 'Usuário já existe. Use outro nome de usuário' });
        }
        return res.status(500).json({ mensagem: 'Erro interno ao cadastrar usuário' });
    }
});


//Rota de Login
app.post('/api/login', async (req, res) => {
    try {
        const { usuario, senha } = req.body;

        const queryVerificar = 'SELECT * FROM usuarios WHERE usuario = ?';
        const [usuarios] = await conexao.promise().query(queryVerificar, [usuario]); //promise() para usar async/await
        if (usuarios.length === 0) {
            return res.status(400).json({ mensagem: 'Usuário ou senha inválidos' });
        }
        const dadosUsuario = usuarios[0];

        const senhaCorreta = await bcrypt.compare(senha, dadosUsuario.senha);
        if (!senhaCorreta) {
            return res.status(400).json({ mensagem: 'Usuário ou senha inválidos' });
        }
        const token = jwt.sign(
            { id: dadosUsuario.id,  usuario: dadosUsuario.usuario },
            SECRET_KEY,
            { expiresIn: '30m' }
        );
        return res.status(200).json({ mensagem: 'Usuário logado', token });

    } catch (erro) {
        return res.status(500).json(erro.message || erro);
    }
});

app.get('/api/usuario', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ mensagem: 'Token não fornecido' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json({ usuario: decoded.usuario }); // Retorna somente o nome do usuário
    } catch (erro) {
        if (erro.name === 'TokenExpiredError') {
            return res.status(401).json({ mensagem: 'Token expirado' });
        }
        res.status(403).json({ mensagem: 'Token inválido' });
    }
});


// Middleware para autenticar o token
app.use('/api/tarefas', autenticarToken);

// Rotas da API
app.get('/api/tarefas', async (req, res) => {
    try {
        const idUsuario = req.usuario.id; // Pega o id do usuário autenticado
        const query = 'SELECT * FROM tarefas WHERE id_usuario = ?';
        const [tarefas] = await conexao.promise().query(query, [idUsuario]);
        if (!tarefas.length) {
            return res.status(404).json({ mensagem: 'Nenhuma tarefa encontrada' });
        } else {
            res.json(tarefas);
        }
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar tarefas' });
    }
});

app.post('/api/tarefas', async (req, res) => {
    try {
        const { descricao } = req.body;
        const idUsuario = req.usuario.id;
        if (!idUsuario || !descricao) {
            return res.status(400).json({ mensagem: 'ID do usuário ou descrição da tarefa não fornecidos' });
        }
        const query = 'INSERT INTO tarefas (id_usuario, descricao) VALUES (?, ?)';
        await conexao.promise().query(query, [idUsuario, descricao]);
        console.log('ID do Usuário:', idUsuario);
        res.status(201).json({ mensagem: 'Tarefa criada com sucesso' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao criar tarefa' });
    }
});

app.patch('/api/tarefas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { concluida } = req.body;

        const query = 'SELECT * FROM tarefas WHERE id = ?';
        const [tarefas] = await conexao.promise().query(query, [id]);

        if (tarefas.length === 0) {
            return res.status(404).json({ erro: 'Tarefa não encontrada' });
        }

        const tarefa = tarefas[0];
        tarefa.concluida = concluida;

        const updateQuery = 'UPDATE tarefas SET concluida = ? WHERE id = ?';
        await conexao.promise().query(updateQuery, [concluida, id]);

        res.status(200).json({ mensagem: 'Tarefa concluida com exito' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao atualizar tarefa' });
    }
});

//Método DELETE
app.delete('/api/tarefas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM tarefas WHERE id = ?';
        await conexao.promise().query(query, [id]);
        res.json({ mensagem: 'Tarefa excluída com sucesso' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao excluir tarefa' });
    }
});


// Inicializa o servidor HTTPS
const PORT = process.env.PORT || 5183;
https.createServer(options, app).listen(PORT, () => {
    console.log(`Servidor rodando em https://localhost:${PORT}`);
});
