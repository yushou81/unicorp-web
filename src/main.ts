import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Toaster } from 'vue-sonner'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import clickOutside from './lib/directives/clickOutside'

console.log('Registering clickOutside directive:', clickOutside);

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('Toaster', Toaster)
app.directive('click-outside', clickOutside)
console.log('clickOutside directive registered');

app.mount('#app') 