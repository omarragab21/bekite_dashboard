import { createApp } from 'vue'
import './style.css'
import './config/firebase'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useTheme } from './composables/useTheme'

const { initTheme } = useTheme();
initTheme();

// Apply language and dir on startup
// Ensure Arabic is always the default language
let lang = localStorage.getItem('lang');
if (!lang || (lang !== 'ar' && lang !== 'en')) {
  lang = 'ar';
  localStorage.setItem('lang', 'ar');
}
document.documentElement.lang = lang;
document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

const app = createApp(App)
app.use(i18n)
app.use(router)
app.mount('#app')
