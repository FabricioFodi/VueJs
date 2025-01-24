<script setup>
import { ref, onMounted } from "vue";

// Estado de autenticação e nome do usuário
const estaLogado = ref(!!localStorage.getItem("token"));
const nomeUsuario = ref("");

// Função para pegar o nome do usuário
async function pegarNomeUsuario() {
  try {
    const response = await fetch("https://localhost:5183/api/usuario", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao pegar o nome do usuário");
    }

    const data = await response.json();
    nomeUsuario.value = data.usuario; // Atualiza o nome do usuário
  } catch (error) {
    console.error("Erro", error);
    nomeUsuario.value = ""; // Reseta o nome do usuário em caso de erro
    estaLogado.value = false; // Considera o usuário como deslogado
  }
}

// Função de logout
async function logout() {
  localStorage.removeItem("token");
  nomeUsuario.value = ""; // Reseta o nome do usuário
  estaLogado.value = false; // Atualiza o estado de login
}

// Ao montar o componente, busca o nome do usuário se logado
onMounted(() => {
  if (estaLogado.value) {
    pegarNomeUsuario();
  }
});
</script>

<template>
  <div class="container">
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
    <div class="titulo">
      <h1>Sobre o Projeto</h1>
    </div>
    <!--Fim div titulo-->
    <div class="conteudo">
  <p>
    Este projeto foi desenvolvido por <strong>Fabricio Fodi</strong>, com o objetivo de estudar as funcionalidades do <strong>Vue.js</strong>.
  </p>
  <p>
    No backend, foi utilizado <strong>Node.js</strong> com <strong>Express</strong>, em conjunto com o banco de dados <strong>MySQL</strong>.
  </p>
  <p>
    Para garantir maior segurança, implementamos a criptografia de senhas utilizando a biblioteca <strong>BCrypt</strong>. 
    Além disso, utilizamos <strong>JSON Web Token (JWT)</strong> para validação das atividades realizadas pelo usuário dentro do aplicativo.
  </p>
  <p>
    Para mais informações, acesse o repositório no GitHub:
  </p>
  <div class="link-git">
    <a target="_blank" href="https://github.com/FabricioFodi/VueJs.git">GitHub Repositório</a>
  </div><!--Fim div link-git-->
</div><!--Fim div conteudo-->

  </div>
  <!--Fim div container-->
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

.titulo {
  text-align: center;
  font-size: 30px;
  font-weight: bold;
  margin: 6px;
  padding-bottom: 30px;
}

.conteudo {
  max-width: 800px;
  margin: 0 auto;
  font-size: 20px;
  line-height: 1.5;
  padding: 0 20px;
  text-align: justify;
  margin-bottom: 40px;
}

.conteudo a {
  padding: 1px 6px;
  border: 1px solid rgba(255, 255, 255, 0.719);
  border-radius: 5px;
  font-size: 18px;
}
.link-git {
  text-align: center;
  margin-top: 40px;
}

</style>
