<script setup>
import { ref } from 'vue'

const tarefas = ref([])
const novaTarefa = ref('')

//Adicionar tarefa método post
async function adicionarTarefa() {
  try {
    const response = await fetch('http://localhost:5183/api/tarefas', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ texto: novaTarefa.value, concluida: false })
    });

    if (!response.ok) {
      const dadosErro = await response.json();
      alert(dadosErro.mensagem || 'Erro desconhecido');
      throw new Error(dadosErro.mensagem || 'Erro desconhecido');
    }
    const data = await response.json();
    alert(data.mensagem);
    novaTarefa.value = '';

  } catch (erro) {
    console.log('Erro', erro)
    alert(erro.mensagem || 'Erro ao adicionar a tarefa')
  }
}

//Listar tarefas método get
async function listarTarefas() {
  try {
    const response = await fetch('http://localhost:5183/api/tarefas', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (!response.ok) {
      const dadosErro = await response.json();
      alert(dadosErro.mensagem || 'Erro desconhecido');
      throw new Error(dadosErro.mensagem || 'Erro desconhecido');
    }
    tarefas.value = await response.json();
  } catch (erro) {
    console.log('Erro', erro)
    alert(erro.mensagem || 'Erro ao listar as tarefas')
  }
}

//Excluir tarefa método delete
async function excluirTarefa() {
 try {
  const response = await fetch(`http://localhost:5183/api/tarefas/${index}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) {
    const dadosErro = await response.json();
    alert(dadosErro.mensagem || 'Erro desconhecido');
    throw new Error(dadosErro.mensagem || 'Erro desconhecido');
  }

  alert('Tarefa excluída com sucesso');
  tarefas.value = tarefas.value.filter(tarefa => tarefa.id !== id);                                                                                                                                                                                             
 } catch (error) {
  console.error('Erro', error);
  alert(error.mensagem || 'Erro ao excluir a tarefa');
 }
}

//alternar tarefa
function alternarTarefa(index) {
  tarefas.value[index].concluida = !tarefas.value[index].concluida
}

</script>

<template>
  <link rel="shortcut icon" href="../public/icone.ico" type="image/x-icon">
  <div>
    <h1>Lista To-Do</h1>

    <input v-model="novaTarefa" @keyup.enter="adicionarTarefa" placeholder="Adicionar nova tarefa" />
    <button @click="adicionarTarefa">Adicionar</button>

    <ul>
      <li v-for="(tarefa, index) in tarefas" :key="index">
        <span :style="{ textDecoration: tarefa.concluida ? 'line-through' : 'none' }" @click="alternarTarefa(index)">
          {{ tarefa.texto }}
        </span>
        <button @click="excluirTarefa(index)">Excluir</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
div {

  margin: 20px;
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