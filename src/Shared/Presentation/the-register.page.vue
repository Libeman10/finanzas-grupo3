<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import LanguageSwitcher from './language-switcher.component.vue';

const backgroundImg = 'https://vannilo.com/wp-content/uploads/bonos-estado.jpg';
const name = ref('');
const email = ref('');
const password = ref('');
const dni = ref('');

const navigateCashFlow = () => {
  router.push('/cash-flow')
}


</script>

<template>
  <div class="register-container" :style="{ backgroundImage: `url(${backgroundImg})` }">
    <div class="register-card">
      <div class="header-container">
        <h1>Registrate</h1>
        <LanguageSwitcher class="language-switcher-header" />
      </div>
      <h2>{{ $t('register.heading') }}</h2>
      
      <div class="form-container">
        <div class="input-group">   
          <pv-float-label>
            <pv-input-text id="name" v-model="name" />
            <label for="name">Nombre</label>
          </pv-float-label>
        </div>

        <div class="input-group">
          <pv-float-label>
            <pv-input-text id="email" v-model="email" type="email" />
            <label for="email">E-mail</label>
          </pv-float-label>
        </div>

        <div class="input-group">
          <pv-float-label>
            <pv-input-text id="password" v-model="password" type="password" />
            <label for="password">Contrasena</label>
          </pv-float-label>
        </div>

        <div class="input-group">
          <pv-float-label>
            <pv-input-text id="dni" v-model="dni" />
            <label for="dni">DNI</label>
          </pv-float-label>
        </div>
        
        <pv-button :label="$t('register.button')" class="register-button" @click="navigateCashFlow" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.register-card {
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

.register-button {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  border-radius: 4px;
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
</style>