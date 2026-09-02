<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="auth-modal-overlay" @click.self="closeModal">
      <div class="auth-modal-content">
        <button class="close-btn" @click="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="modal-header">
          <div class="logo-wrapper">
            <img v-if="logo" :src="logo" :alt="siteName" class="modal-logo-img" />
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#873260" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-bag">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h2 class="title" :dir="isRTL ? 'rtl' : 'ltr'">{{ t('auth.welcome') }}</h2>
          <p class="subtitle" :dir="isRTL ? 'rtl' : 'ltr'">{{ t('auth.welcome_subtitle') }}</p>
        </div>

        <div class="tabs" :style="{ direction: isRTL ? 'rtl' : 'ltr' }">
          <button 
            class="tab-btn" 
            :class="{ active: currentTab === 'login' }"
            @click="currentTab = 'login'; clearMessages()"
          >
            {{ t('auth.login') }}
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: currentTab === 'register' }"
            @click="currentTab = 'register'; clearMessages()"
          >
            {{ t('auth.register') }}
          </button>
        </div>

        <!-- Custom Alerts -->
        <div v-if="globalSuccess" class="custom-alert success-alert" :dir="isRTL ? 'rtl' : 'ltr'">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
          <span>{{ globalSuccess }}</span>
        </div>

        <div v-if="globalError" class="custom-alert error-alert" :dir="isRTL ? 'rtl' : 'ltr'">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <span>{{ globalError }}</span>
        </div>

        <!-- Login Form -->
        <form v-if="currentTab === 'login'" @submit.prevent="handleLogin" class="auth-form" :dir="isRTL ? 'rtl' : 'ltr'" :class="{ rtl: isRTL }">
          <div class="form-group">
            <label>{{ t('auth.email') }}</label>
            <div class="input-wrapper">
              <input type="email" v-model="loginForm.email" placeholder="example@tijara.com" required />
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
            </div>
          </div>

          <div class="form-group">
            <label>{{ t('auth.password') }}</label>
            <div class="input-wrapper">
              <input :type="showLoginPassword ? 'text' : 'password'" v-model="loginForm.password" placeholder="••••••••" required />
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <button type="button" class="eye-btn" @click="showLoginPassword = !showLoginPassword">
                <i :class="showLoginPassword ? 'far fa-eye-slash' : 'far fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="forgot-password">
            <a href="#" @click.prevent="currentTab = 'forgot-password'">{{ t('auth.forgot_password') }}</a>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? t('common.loading') : t('auth.login') }}
          </button>

          <div class="continue-browsing">
            <a href="#" @click.prevent="closeModal">{{ t('auth.continue_browsing') }}</a>
          </div>
        </form>

        <form v-else-if="currentTab === 'register'" @submit.prevent="handleRegister" class="auth-form" :dir="isRTL ? 'rtl' : 'ltr'" :class="{ rtl: isRTL }">
          <div class="form-group">
            <label>{{ t('auth.full_name') }}</label>
            <div class="input-wrapper">
              <input type="text" v-model="registerForm.name" :placeholder="t('auth.full_name')" required />
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
          </div>

          <div class="form-group">
            <label>{{ t('auth.email') }}</label>
            <div class="input-wrapper">
              <input type="email" v-model="registerForm.email" placeholder="example@tijara.com" required />
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
            </div>
          </div>

          <div class="form-group">
            <label>{{ t('auth.mobile_number') }}</label>
            <div class="phone-input-wrapper" :class="{ rtl: isRTL }">
              <div class="country-code">
                <span class="flag">🇯🇴</span>
                <span dir="ltr">+962</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
              <input type="tel" v-model="registerForm.phone" placeholder="7xxxxxxxx" required dir="ltr" />
            </div>
          </div>

          <div class="form-group">
            <label>{{ t('auth.password') }}</label>
            <div class="input-wrapper">
              <input :type="showRegisterPassword ? 'text' : 'password'" v-model="registerForm.password" placeholder="••••••••" required minlength="6" />
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <button type="button" class="eye-btn" @click="showRegisterPassword = !showRegisterPassword">
                <i :class="showRegisterPassword ? 'far fa-eye-slash' : 'far fa-eye'"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? t('common.loading') : t('auth.register') }}
          </button>

          <div class="continue-browsing">
            <a href="#" @click.prevent="closeModal">{{ t('auth.continue_browsing') }}</a>
          </div>
        </form>

        <form v-else-if="currentTab === 'forgot-password'" @submit.prevent="handleForgotPassword" class="auth-form" :dir="isRTL ? 'rtl' : 'ltr'" :class="{ rtl: isRTL }">
          <div class="form-group">
            <label>{{ t('auth.email') }}</label>
            <div class="input-wrapper">
              <input type="email" v-model="forgotPasswordForm.email" placeholder="example@tijara.com" required />
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
            </div>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? t('common.loading') : t('auth.reset_password_link') }}
          </button>

          <div class="continue-browsing">
            <a href="#" @click.prevent="currentTab = 'login'">{{ t('auth.back_to_login') }}</a>
          </div>
        </form>
    </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive, computed, defineExpose, defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import { authActions, authState } from '../store/auth'
import api from '../config/axios'

const { t, locale } = useI18n()
const isRTL = computed(() => locale.value === 'ar')

defineProps({
  logo: String,
  siteName: String
})

const isOpen = ref(false)
const currentTab = ref('login')
const loading = computed(() => authState.loading)
const globalError = ref('')
const globalSuccess = ref('')
const showLoginPassword = ref(false)
const showRegisterPassword = ref(false)

const loginForm = reactive({
  email: '',
  password: ''
})

const registerForm = reactive({
  name: '',
  email: '',
  phone: '',
  password: '' 
})

const forgotPasswordForm = reactive({
  email: ''
})

const clearMessages = () => {
  globalError.value = ''
  globalSuccess.value = ''
}

const openModal = () => {
  isOpen.value = true
  document.body.style.overflow = 'hidden' 
  clearMessages()
}

const closeModal = () => {
  isOpen.value = false
  currentTab.value = 'login'
  document.body.style.overflow = ''
}

const handleForgotPassword = async () => {
  clearMessages()
  try {
    const res = await api.post('/frontend/forgot-password', forgotPasswordForm)
    globalSuccess.value = res.data.message || t('auth.forgot_password_success')
    forgotPasswordForm.email = ''
  } catch (error) {
    console.error(error)
    globalError.value = error.response?.data?.message || t('auth.forgot_password_error')
  }
}

const handleLogin = async () => {
  clearMessages()
  try {
    const res = await authActions.login(loginForm)
    globalSuccess.value = res.message || t('auth.login_success')
    setTimeout(() => {
      closeModal()
      const redirect = localStorage.getItem('redirectAfterAuth')
      if (redirect) {
        localStorage.removeItem('redirectAfterAuth')
        window.location.href = redirect
      } else {
        window.location.reload()
      }
    }, 1000)
  } catch (error) {
    console.error(error)
    globalError.value = error.response?.data?.message || t('auth.login_error')
  }
}

const handleRegister = async () => {
  clearMessages()
  try {
    const res = await authActions.register(registerForm)
    globalSuccess.value = res.message || t('auth.register_success')
    setTimeout(() => {
      closeModal()
      const redirect = localStorage.getItem('redirectAfterAuth')
      if (redirect) {
        localStorage.removeItem('redirectAfterAuth')
        window.location.href = redirect
      } else {
        window.location.reload()
      }
    }, 1000)
  } catch (error) {
    console.error(error)
    globalError.value = error.response?.data?.message || t('auth.register_error')
  }
}

defineExpose({
  openModal,
  closeModal
})
</script>

<style scoped>
.auth-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Almarai', sans-serif;
}

.auth-modal-content {
  background: #fff;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  border-radius: 16px;
  padding: 30px;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  margin: 20px;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background: #f3f4f6;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.modal-header {
  text-align: center;
  margin-bottom: 25px;
}

.logo-wrapper {
  background: transparent;
  width: 140px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
}

.modal-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 5px;
}

.title {
  font-size: 24px;
  color: #111827;
  margin: 0 0 8px;
}

.subtitle {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.tabs {
  display: flex;
  background: #f9fafb;
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 25px;
}

.tab-btn {
  flex: 1;
  padding: 10px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 15px;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: #873260;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(135, 50, 96, 0.2);
}

.custom-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 700;
}

.success-alert {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.error-alert {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.auth-form.rtl .form-group {
  text-align: right;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  width: 100%;
  padding: 14px 14px 14px 45px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  transition: border-color 0.2s;
  outline: none;
  text-align: left;
}

.auth-form.rtl .input-wrapper input {
  padding: 14px 45px 14px 14px;
  text-align: right;
}

.input-wrapper .input-icon {
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
  z-index: 1;
}

.auth-form.rtl .input-wrapper .input-icon {
  left: auto;
  right: 15px;
}

.eye-btn {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  z-index: 2;
}

.auth-form.rtl .eye-btn {
  right: auto;
  left: 15px;
}

.phone-input-wrapper {
  display: flex;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.2s;
  position: relative;
}

.phone-input-wrapper:focus-within {
  border-color: #873260;
}

.country-code {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  background: #f9fafb;
  border-left: 1px solid #e5e7eb;
  font-size: 14px;
  color: #374151;
}

.phone-input-wrapper.rtl .country-code {
  border-left: none;
  border-right: 1px solid #e5e7eb;
}

.phone-input-wrapper input {
  flex: 1;
  padding: 14px 16px 14px 44px;
  border: none;
  font-size: 14px;
  outline: none;
}

.phone-input-wrapper.rtl input {
  padding: 14px 44px 14px 16px;
}

.phone-input-wrapper .input-icon {
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
  z-index: 1;
}

.phone-input-wrapper.rtl .input-icon {
  left: auto;
  right: 14px;
}

.forgot-password {
  text-align: left;
  margin-bottom: 20px;
}

.auth-form.rtl .forgot-password {
  text-align: right;
}

.forgot-password a {
  color: #873260;
  font-size: 13px;
  text-decoration: none;
  font-weight: 500;
}

.forgot-password a:hover {
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  background: #873260;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover {
  background: #4a1936;
}

.submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.continue-browsing {
  text-align: center;
  margin-top: 20px;
}

.continue-browsing a {
  color: #6b7280;
  font-size: 14px;
  text-decoration: none;
}

.continue-browsing a:hover {
  color: #374151;
  text-decoration: underline;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
