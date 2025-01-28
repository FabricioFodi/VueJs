import './assets/main.css'
import './assets/base.css'

import { createApp } from 'vue'
import App from './routes.vue'

createApp(App).mount('#app')

const toggleDarkMode = () => {
    const htmlElement = document.documentElement; // Seleciona o <html>
    htmlElement.classList.toggle('dark-mode');
  
    // Salva a preferência do usuário no localStorage
    const isDarkMode = htmlElement.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  };
  
  // Verifica a preferência salva no localStorage ao carregar a página
  window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    }
  });
  