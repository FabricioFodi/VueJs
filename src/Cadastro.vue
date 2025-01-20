<script setup>
import { ref } from "vue";

const usuario = ref("");
const senha = ref("");

//Cadastro método post
async function cadastrarUsuario() {
  try {
    if (!usuario.value || !senha.value) {
      alert("Preencha todos os campos");
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
  </div>
  <!--Fim div Cabecalho-->
  <div class="corpo">
    <div class="cadastro">
      <div class="titulo-cadastro">
        <h1>Cadastro</h1>
        <p>Faça seu cadastro agora para usar todos os recursos do site</p>
      </div>
      <!--Fim div titulo-caadastro-->
      <input type="text" v-model="usuario" placeholder="Usuário" />
      <input type="password" v-model="senha" placeholder="Senha" />
      <button @click="cadastrarUsuario">Cadastrar</button>
      <div class="link-login">
        <p>Já tem cadastro? <a href="#/login">clique aqui</a> para fazer login.</p>
      </div><!--Fim div link-login-->
    </div><!--Fim div Cadastro-->
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

.titulo-cadastro {
  margin: 20px;
}

.titulo-cadastro h1 {
  margin-bottom: 10px;
}

.cadastro {
  width: 400px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.cadastro input {
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

.cadastro button {
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

.cadastro button:hover {
  transform: scale(1.05);
  transition: 0.5s;
}

.link-login {
  margin: 20px;
  font-size: small;
}

.link-login a:hover {
  text-decoration: underline;
}

.cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}
</style>
