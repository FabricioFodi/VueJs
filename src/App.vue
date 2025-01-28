// Tarefas

<script setup>
import { ref, onMounted } from "vue";

// Estado de autenticação e nome do usuário
const estaLogado = ref(!!localStorage.getItem("token"));
const nomeUsuario = ref("");
const tarefas = ref([]);
const novaTarefa = ref("");
window.onload = function () {
  document.getElementById("novaTarefa").focus();
}

if (!localStorage.getItem("token")) {
  alert("Você precisa estar logado para acessar essa página");
  window.location.hash = "#/login";
}

//Adicionar tarefa método post
async function adicionarTarefa() {
  try {
    if(!novaTarefa.value){
      alert("Digite uma tarefa");
      return;
    }
    const response = await fetch("https://localhost:5183/api/tarefas", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ descricao: novaTarefa.value, concluida: false }),
    });

    if (!response.ok) {
      const dadosErro = await response.json();
      alert(dadosErro.mensagem || "Erro desconhecido");
      throw new Error(dadosErro.mensagem || "Erro desconhecido");
    }
    const data = await response.json();
    alert(data.mensagem);
    novaTarefa.value = "";
    listarTarefas();
  } catch (erro) {
    alert(erro.mensagem || "Erro ao adicionar tarefa");
  }
}

//Listar tarefas método get
async function listarTarefas() {
  try {
    const response = await fetch("https://localhost:5183/api/tarefas", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const dadosErro = await response.json();
      alert(dadosErro.mensagem || "Erro desconhecido");
      throw new Error(dadosErro.mensagem || "Erro desconhecido");
    }
    tarefas.value = await response.json();
  } catch (erro) {
    console.log("Erro", erro);
  }
}

//Excluir tarefa método delete
async function excluirTarefa(index) {
  try {
    const response = await fetch(`https://localhost:5183/api/tarefas/${index}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const dadosErro = await response.json();
      alert(dadosErro.mensagem || "Erro desconhecido");
      throw new Error(dadosErro.mensagem || "Erro desconhecido");
    }

    alert("Tarefa excluída com sucesso");
    tarefas.value = tarefas.value.filter((tarefa) => tarefa.index !== index);
  } catch (error) {
    console.error("Erro", error);
  }

  listarTarefas();
}

//alternar tarefa
async function alternarTarefa(index) {
  const tarefa = tarefas.value[index];

  try {
    //Atualizar a tarefa no backend
    const response = await fetch(`https://localhost:5183/api/tarefas/${tarefa.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ concluida: !tarefa.concluida }),
    });
    if (!response.ok) {
      const dadosErro = await response.json();
      alert(dadosErro.mensagem || "Erro desconhecido");
      throw new Error(dadosErro.mensagem || "Erro desconhecido");
    }
    tarefa.concluida = !tarefa.concluida;
  } catch (erro) {
    console.error("Erro", erro);
  }
}

// Função para pegar o nome do usuário
async function pegarNomeUsuario() {
  try {
    const response = await fetch("https://localhost:5183/api/usuario", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
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
  <div class="principal">
    <h1>Lista To-Do</h1>
    <div class="inputs">
      <input
      id="novaTarefa"
        v-model="novaTarefa"
        @keyup.enter="adicionarTarefa"
        placeholder="Adicionar nova tarefa"
      />
      <button @click="adicionarTarefa">Adicionar</button>
      <button @click="listarTarefas">Listar</button>
    </div>
    <!--Fim div inputs-->
    <div class="lista">
      <ul>
        <li v-for="(tarefa, index) in tarefas" :key="index">
          <span
            title="Clique para marcar/desmarcar como concluída"
            :style="{ textDecoration: tarefa.concluida ? 'line-through' : 'none' }"
            @click="alternarTarefa(index)"
          >
            {{ tarefa.descricao }}
          </span>
          <button @click="excluirTarefa(tarefa.id)">Excluir</button>
        </li>
      </ul>
    </div>
    <!--Fim div lista de tarefas-->
  </div>
  <!--Fim div principal-->
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

.principal {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.inputs {
  display: flex;
  margin-top: 20px;
}

.inputs input {
  width: 220px;
  height: 25px;
  box-sizing: border-box;
  border-radius: 10px;
  font-size: 13px;
  padding-left: 5px;
}

.inputs button {
  box-sizing: border-box;
  border-radius: 12px;
  padding: 5px 15px;
  font-size: 13px;
  margin-left: 7px;
  cursor: pointer;
}

.lista {
  margin-top: 20px;
}

.lista ul {
  list-style-type: none;
  padding: 0;
}

.lista li {
  margin-top: 10px;
}

.lista span {
  cursor: pointer;
}

.lista button {
  margin-left: 10px;
  cursor: pointer;
}
</style>
