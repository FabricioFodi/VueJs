<script setup>
import { ref, computed } from 'vue';
import Login from './login.vue';
import App from './App.vue';
import Cadastro from './Cadastro.vue';
import NotFound from './NotFound.vue';

const routes = {
    '/login': Login,
    '/cadastro': Cadastro,
    '/tarefas': App,
    '/oops': NotFound
}



// Detectar se o hash inicial está vazio e redirecionar para "/login"
if (!window.location.hash || window.location.hash === '/') {
    window.location.hash = '#/login';
}

const currentPath = ref(window.location.hash);

window.addEventListener('hashchange', () => {
    currentPath.value = window.location.hash;
});

const currentView = computed(() => {
    const route = routes[currentPath.value.slice(1)];
    if (!route) {
        window.location.hash = '#/oops'; // Redirecionar para a página de erro
        return NotFound; // Como fallback para evitar problemas
    }
    return route;
});

</script>

<template>
    <component :is="currentView" />
</template>