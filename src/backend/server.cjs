const { conexao } = require('./conexao.cjs');
const { autenticarToken, SECRET_KEY } = require('./middleware.cjs');
const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // URL do frontend
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
        const queryVerificar = 'SELECT * FROM usuarios WHERE usuario = ?';
        const [usuarios] = await conexao.promise().query(queryVerificar, [usuario]);

        if (usuarios.length > 0) {
            return res.status(400).json({ mensagem: `Usuário ${usuario} já existe` });
        }

        // Criptografar a senha e tratar erro
        let senhaCriptografada;
        try {
            senhaCriptografada = await bcrypt.hash(senha, 10);
        } catch (erro) {
            console.error('Erro ao criptografar a senha:', erro);
            return res.status(500).json({ mensagem: 'Erro ao criptografar a senha' });
        }

        // Inserir usuário no banco de dados
        const queryInserir = 'INSERT INTO usuarios (usuario, senha) VALUES (?, ?)';
        await conexao.promise().query(queryInserir, [usuario, senhaCriptografada]);

        return res.status(201).json({ mensagem: `Usuário ${usuario} cadastrado com sucesso` });

    } catch (erro) {
        console.error('Erro ao cadastrar usuário:', erro);
        return res.status(500).json({ mensagem: 'Erro ao cadastrar usuário' });
    }
});


//Rota de Login
app.post('api/login', async (req, res) => {
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
            { usuario: dadosUsuario.usuario },
            'chave-secreta',
            { expiresIn: '30m' }
        );
        return res.status(200).json({ mensagem: 'Usuário logado', token });

    } catch (erro) {
        console.error('Erro ao processar login:', erro);
        return res.status(500).json({ erro: 'Erro ao processar login' || erro.message });
    }
});

app.use('/api/tarefas', autenticarToken);

// Rotas da API
app.get('/api/tarefas', async (req, res) => {
    try {
        const query = 'SELECT * FROM tarefas';
        const [tarefas] = await conexao.promise().query(query);
        res.json(tarefas);
    } catch (erro) {
        console.error('Erro ao buscar tarefas:', erro);
        res.status(500).json({ erro: 'Erro ao buscar tarefas' });
    }
});

app.post('/api/tarefas', async (req, res) => {
    try {
        const { descricao } = req.body;
        if (!descricao) {
            return res.status(400).json({ erro: 'Descrição é obrigatório' });
        }

        const query = 'INSERT INTO tarefas (descricao) VALUES (?)';

        await conexao.promise().query(query, [descricao]);
        res.status(201).json({ mensagem: 'Tarefa criada com sucesso' });
    } catch (erro) {
        console.error('Erro ao criar tarefa:', erro);
        res.status(500).json({ erro: 'Erro ao criar tarefa' });
    }
});

// Inicializa o servidor
const PORT = process.env.PORT || 5183;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
