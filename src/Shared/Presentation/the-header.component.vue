<script setup>
import { useRouter } from 'vue-router'
import LanguageSwitcher from './language-switcher.component.vue'

const router = useRouter()

const navigateToLogIn = () => {
  router.push('/login')
}

const navigateToRegister = () => {
  router.push('/register')
}

</script>

<template>
  <pv-toolbar class="toolbar">
    <template #start>
      <div class="flex gap-2">
        <h1>Bonosalfallo</h1>
      </div>
    </template>
    <template #center>
      <div class="flex gap-2">
        <pv-button label="Iniciar sesion" icon="pi pi-home" @click="navigateToLogIn" />
        <pv-button label="Registrarse" icon="pi pi-wallet" @click="navigateToRegister" />
      </div>
    </template>
    <template #end>
      <LanguageSwitcher />
    </template>
  </pv-toolbar>
</template>

<style scoped>
.toolbar {
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
}
.flex {
  display: flex;
}

.gap-2 {
  gap: 0.5rem;
}
</style>