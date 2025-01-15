const jwt = require('jsonwebtoken');

const SECRET_KEY = 'minha_chave_super_secreta-123';

const autenticarToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ mensagem: 'Token não fornecido' });
    }
    jwt.verify(token, SECRET_KEY, (erro, decoded) => {
        if (erro) {
            return res.status(403).json({ mensagem: 'Token inválido. Faça login novamente' });
        }
        req.usuario = decoded; // Armazenando as informações do usuário no req
        next();
    });
};

module.exports = { autenticarToken, SECRET_KEY };