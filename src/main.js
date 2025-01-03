
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import App from './App.vue';
import router from './router';
import './index.css'

const app = createApp(App); // Créez une instance de l'application
const pinia = createPinia(); // Créez une instance de Pinia

app.use(pinia); // Associez Pinia à l'application
app.use(router);// Associer routeur à l'application
app.mount('#app'); // Montez l'application
