<script setup>
import { ref } from "vue";

const tarefas = ref([]);
const novaTarefa = ref("");

if (!localStorage.getItem("token")) {
  window.location.hash = "#/login";
}

//Adicionar tarefa método post
async function adicionarTarefa() {
  try {
    if (!novaTarefa.value) {
      alert("Digite uma tarefa");
      return;
    }
    const response = await fetch("http://localhost:5183/api/tarefas", {
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
  } catch (erro) {
    alert(erro.mensagem || "Erro ao adicionar tarefa");
  }
  listarTarefas();
}

//Listar tarefas método get
async function listarTarefas() {
  try {
    const response = await fetch("http://localhost:5183/api/tarefas", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    alert(erro.mensagem || "Erro ao listar as tarefas");
  }
}

//Excluir tarefa método delete
async function excluirTarefa(index) {
  try {
    const response = await fetch(`http://localhost:5183/api/tarefas/${index}`, {
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

  try{
  //Atualizar a tarefa no backend
  const response = await fetch(`http://localhost:5183/api/tarefas/${tarefa.id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({concluida: !tarefa.concluida}),
    });
    if(!response.ok) {
      const dadosErro = await response.json();
      alert(dadosErro.mensagem || 'Erro desconhecido');
      throw new Error(dadosErro.mensagem || 'Erro desconhecido');
    }
    tarefa.concluida = !tarefa.concluida;

  } catch(erro) {
    console.error('Erro', erro);
  }
}

async function logout() {
  localStorage.removeItem("token");
  window.location.hash = "#/login";
}
</script>

<template>
  <link rel="shortcut icon" href="../public/icone.ico" type="image/x-icon" />
  <div>
    <h1>Lista To-Do</h1>
    <button @click="logout">Sair</button>

    <input
      v-model="novaTarefa"
      @keyup.enter="adicionarTarefa"
      placeholder="Adicionar nova tarefa"
    />
    <button @click="adicionarTarefa">Adicionar</button>
    <button @click="listarTarefas">Listar</button>

    <div class="lista">
      <ul>
        <li v-for="(tarefa, index) in tarefas" :key="index">
          <span
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
div {
  margin: 20px;
}
.lsita {
  margin-top: 20px;
}

input {
  margin-left: 0;
}

button {
  box-sizing: border-box;
  border-radius: 12px;
  padding: 3px 9px;
  font-size: 13px;
  margin-left: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-top: 10px;
}

span {
  cursor: pointer;
}
</style>
