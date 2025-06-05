<script setup>
import { ref } from 'vue';
import LanguageSwitcher from './language-switcher.component.vue';

const loginSceneImg = 'https://media.licdn.com/dms/image/v2/C4E12AQFh91kuqmjmZA/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1619844827937?e=2147483647&v=beta&t=7LYT6xLpgAdtu5YUyq6p_Q8UM9V9dNGXeqP-cqCVjoY';
const username = ref('');
const password = ref('');
</script>

<template>
  <div class="login-container" :style="{ backgroundImage: `url(${loginSceneImg})` }">
    <div class="login-card">
      <div class="header-container">
        <h1>Inicia sesion</h1>
        <LanguageSwitcher class="language-switcher-header" />
      </div>
      <h2>Porfavor hazlo</h2>
      
      <div class="form-container">
        <div class="input-group">
          <pv-float-label>
            <pv-input-text id="username" v-model="username" />
            <label for="username">Usuario</label>
          </pv-float-label>
        </div>
        <div class="input-group">
          <pv-float-label>
            <pv-input-text id="password" type="password" v-model="password" />
            <label for="password">Contrasena</label>
          </pv-float-label>
        </div>
        <router-link to="/cash-flow">
          <pv-button label="Iniciar Sesion" class="login-button" />
        </router-link>
      </div>

      <div class="links">
        <div class="signup">
          <span>Sin cuenta?</span>
          <router-link to="/register">Registrate</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #666;
  font-weight: 400;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  margin-bottom: 1rem;
}

:deep(.p-float-label) {
  width: 100%;
}

:deep(.p-inputtext) {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.language-switcher-login {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.language-switcher-header {
  margin-left: 1rem;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  border-radius: 4px;
}

.links {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.signup {
  display: flex;
  gap: 0.5rem;
}

a {
  color: #2196F3;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

span {
  color: #666;
}
</style>