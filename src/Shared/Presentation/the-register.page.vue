<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const dni = ref("");

const navigateCashFlow = () => {
  router.push("/the-menu");
};
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="register-title">Regístrate</h1>

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
            <label for="password">Contraseña</label>
          </pv-float-label>
        </div>

        <div class="input-group">
          <pv-float-label>
            <pv-input-text id="dni" v-model="dni" />
            <label for="dni">DNI</label>
          </pv-float-label>
        </div>

        <pv-button
          :label="$t('register.button')"
          class="register-button"
          @click="navigateCashFlow"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap");

.register-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: "Work Sans", sans-serif;
  background: linear-gradient(
    135deg,
    #0f172a 0%,
    #1e293b 25%,
    #334155 50%,
    #1e40af 75%,
    #3b82f6 100%
  );
  padding: 1rem;
}

.register-card {
  width: 100%;
  max-width: 400px;
  background: rgba(30, 41, 59, 0.85);
  padding: 2rem;
  border-radius: 16px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  color: #e2e8f0;
}

.register-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
  text-align: center;
}

.register-subtitle {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #cbd5e1;
  font-weight: 400;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.input-group {
  margin-bottom: 0.5rem;
}

:deep(.p-float-label) {
  width: 100%;
}

:deep(.p-inputtext) {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #475569;
  border-radius: 6px;
  background-color: #1e293b;
  color: #e2e8f0;
}

:deep(.p-inputtext::placeholder) {
  color: #94a3b8;
}

.register-button {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  font-weight: bold;
  background: #3b82f6;
  color: white;
  border-radius: 8px;
  transition: background 0.3s;
}

.register-button:hover {
  background: #3472e5;
}
</style>
