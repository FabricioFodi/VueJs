CREATE DATABASE IF NOT EXISTS tarefas;
USE tarefas;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS tarefas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(50) NOT NULL,
    descricao VARCHAR(150),
    concluida BOOLEAN DEFAULT FALSE,
    id_usuario INT NOT NULL,
    data_publicacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

SELECT * FROM usuarios;
SELECT * FROM tarefas;

-- trocar o ? pelo id do usuário para listar as tarefas do usuário
SELECT * FROM tarefas WHERE id_usuario = ?;