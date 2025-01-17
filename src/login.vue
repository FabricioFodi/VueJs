<script setup>
import { ref } from "vue";

const usuario = ref("");
const senha = ref("");

//Login método post
async function login() {
  try {
    if (!usuario.value || !senha.value) {
      alert("Preencha todos os campos");
      return;
    }

    const response = await fetch("http://localhost:5183/api/login", {
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
    localStorage.setItem("token", data.token);
    alert(data.mensagem);
    window.location.hash = "#/home";
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
  <div class="corpo">
    <div class="login">
      <div class="titulo-login">
        <h1>Login</h1>
        <p>Entre com seu usuário e senha para acessar todos os recursos</p>
      </div><!--Fim div titulo-login-->
        <input type="text" v-model="usuario" placeholder="Usuário" />
        <input type="password" v-model="senha" @keyup.enter="login" placeholder="Senha" />
        <button @click="login">Entrar</button>
        <div class="link-para-cadastro">
          <p>Não tem conta? <a href="#/cadastro">clique aqui</a> para criar.</p>
        </div><!--Fim div link-para-cadastro-->
  </div><!--Fim div Login-->
</div><!--Fim div Corpo-->
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

* {
 font-family: 'Montserrat', sans-serif;
}

.corpo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 700px;
}

.titulo-login {
  margin: 20px;
}

.titulo-login h1 {
  margin-bottom: 10px;
}

.login {
  width: 400px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.login input {
  margin: 10px 0;
  padding: 10px;
  width: 70%;
  height: 35px;
  border-radius: 16px;
  border: 1px solid #ccc;
  border-color: hsla(160, 100%, 37%, 1);
  background-color: rgb(41, 41, 41);
  color: white;
  outline: none;

}

.login button {
  margin: 10px 0;
  padding: 5px;
  width: 50%;
  height: 30px;
  border-radius: 16px;
  border: 1px solid #000000;
  background-color: hsla(160, 100%, 37%, 1); 
  cursor: pointer;
  font-weight: 700;
}

.login button:hover {
  transform: scale(1.05);
  transition: 0.5s;
}

.link-para-cadastro {
  margin: 20px;
  font-size: small;
}

.link-para-cadastro a:hover {
  text-decoration: underline;
}

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