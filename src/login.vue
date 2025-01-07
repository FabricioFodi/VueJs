<script setup>
import { ref } from 'vue';

const usuario = ref('');
const senha = ref('');

//Login método post
async function login() {
    try {
        const response = await fetch('http://localhost:5183/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario: usuario.value, senha: senha.value })
        });
        if (!response.ok) {
            const dadosErro = await response.json();
            alert(dadosErro.mensagem || 'Erro desconhecido');
            throw new Error(dadosErro.mensagem || 'Erro desconhecido');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        alert(data.mensagem);
        window.location.href = '/';

    } catch (erro) {
        console.error('Erro', erro);
        alert(erro.message || 'Erro ao fazer login');
    }
}

</script>

<template>
    <link rel="shortcut icon" href="../public/icone.ico" type="image/x-icon">
    <div class="login">
        <h1>Login</h1>
        <input type="text" v-model="usuario" placeholder="Usuário">
        <input type="password" v-model="senha" placeholder="Senha">
        <button @click="login">Entrar</button>
        <p>Não tem cadastro? <a href="#/cadastro">clique aqui</a> para criar uma conta.</p>
    </div>

</template>

<style scoped></style>