<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const navigateToLogIn = () => {
  router.push("/login");
};

const navigateToRegister = () => {
  router.push("/register");
};
</script>

<template>
  <div class="custom-toolbar">
    <div class="logo">Bonos<span class="highlight">AlFallo</span></div>

    <div class="actions">
      <pv-button
        label="Iniciar sesión"
        icon="pi pi-sign-in"
        class="toolbar-button"
        @click="navigateToLogIn"
      />
      <pv-button
        label="Registrarse"
        icon="pi pi-user-plus"
        class="toolbar-button"
        @click="navigateToRegister"
      />
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;600&display=swap");

.custom-toolbar {
  padding: 1rem 2rem;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(59, 130, 246, 0.3);
  font-family: "Work Sans", sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.logo {
  font-size: 1.8rem;
  font-weight: 600;
  color: #e2e8f0;
}

.logo .highlight {
  color: #60a5fa;
}

.actions {
  display: flex;
  gap: 1rem;
}

.toolbar-button {
  background: rgba(30, 41, 59, 0.8);
  color: #e2e8f0;
  border: 1px solid rgba(59, 130, 246, 0.3);
  font-weight: bold;
  backdrop-filter: blur(15px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.toolbar-button:hover {
  background-color: #3472e5;
  color: #ffffff;
  border-color: rgba(96, 165, 250, 0.6);
}
</style>
