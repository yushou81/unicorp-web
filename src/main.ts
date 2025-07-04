import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Toaster } from 'vue-sonner'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import clickOutside from './lib/directives/clickOutside'
import { setToken } from './lib/api/apiClient'

console.log('Registering clickOutside directive:', clickOutside);

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 3,
  newestOnTop: true,
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false
})
app.component('Toaster', Toaster)
app.directive('click-outside', clickOutside)
console.log('clickOutside directive registered');

const token = localStorage.getItem('token')
if (token) setToken(token)

app.mount('#app') 