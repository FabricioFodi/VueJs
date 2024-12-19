<script setup>
import { ref, computed } from 'vue';
import Login from './login.vue';
import App from './App.vue';
import Cadastro from './Cadastro.vue';
import NotFound from './NotFound.vue';

const routes = {
    '/': Login,
    '/cadastro': Cadastro,
    '/tarefas': App
}

const currentPath = ref(window.location.hash);

window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash;
});

const currentView = computed(() => {
    return routes[currentPath.value.slice(1) || '/'] || NotFound;
});

</script>

<template>
    <component :is="currentView" />
</template>