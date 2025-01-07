<script setup>
import { ref } from "vue";

const usuario = ref("");
const senha = ref("");

//Cadastro método post
async function cadastrarUsuario() {
  try {
    if (!usuario.value || !senha.value) {
      alert(data.mensagem || "Preencha todos os campos");
      return;
    }

    const response = await fetch("http://localhost:5183/api/cadastro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario: usuario.value, senha: senha.value }),
    });

    if (!response.ok) {
      const dadosErro = await response.json();
      alert(dadosErro.mensagem || "Erro desconhecido");
      throw new Error(dadosErro.mensagem || "Erro desconhecido");
    }
    const data = await response.json();
    alert(data.mensagem);
    window.location.href = "/";

  } catch (erro) {
    console.error("Erro", erro);
    alert(erro.mesagem || "Erro ao cadastrar o usuário");
  }
}
</script>

<template>
  <link rel="shortcut icon" href="../public/icone.ico" type="image/x-icon" />
  <div class="cadastro">
    <h1>Cadastro</h1>
    <input type="text" v-model="usuario" placeholder="Usuário" />
    <input type="password" v-model="senha" placeholder="Senha" />
    <button @click="cadastrarUsuario">Cadastrar</button>
    <p>Já tem cadastro? <a href="#/login">clique aqui</a> para fazer login.</p>
  </div>
</template>

<style scoped></style>
