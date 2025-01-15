<script setup>
import { ref } from "vue";

const usuario = ref('');
const senha = ref('');

//Cadastro método post
async function cadastrarUsuario() {
  try {
    if (!usuario.value || !senha.value) {
      alert("Preencha todos os campos");
      return;
    }

    const response = await fetch("http://localhost:5183/api/cadastro", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
  }
}
</script>

<template>
  <link rel="shortcut icon" href="../public/icone.ico" type="image/x-icon" />
  <div class="cabecalho">
    <h1><a href="#/home">Home</a></h1>
    <div class="auth-links">
      <div class="sign-in">
        <a v-if="!estaLogado" href="#/login">Login</a>
        <div v-else>
          <span>Olá, {{ nomeUsuario || "Usuário" }}</span>
        </div>
        <!--Fim div Else dentro da div Sign-in-->
      </div>
      <!--Fim div Sign-in-->
      <div class="sign-up">
        <a v-if="!estaLogado" href="#/cadastro">Cadastrar-se</a>
        <div v-else>
          <a @click="logout" href="#/home">Sair</a>
        </div>
        <!--Fim div Else dentro da div Sign-up-->
      </div>
      <!--Fim div Sign-up-->
    </div>
    <!--Fim div Auth-links-->
  </div>
  <!--Fim div Cabecalho-->
  <div class="cadastro">
    <h1>Cadastro</h1>
    <input type="text" v-model="usuario" placeholder="Usuário" />
    <input type="password" v-model="senha" placeholder="Senha" />
    <button @click="cadastrarUsuario">Cadastrar</button>
    <p>Já tem cadastro? <a href="#/login">clique aqui</a> para fazer login.</p>
  </div>
</template>

<style scoped>

.cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.auth-links {
  margin-left: auto;
  display: flex;
}

.auth-links .sign-in,
.auth-links .sign-up {
  margin-left: 10px;
}

.sign-up {
  padding: 1px 2px;
  border: 1px solid rgba(255, 255, 255, 0.719);
  border-radius: 5px;
}

</style>
