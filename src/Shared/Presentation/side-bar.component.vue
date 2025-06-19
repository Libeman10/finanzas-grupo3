<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const visible = ref(false)
const router = useRouter()

const navigateTo = (route) => {
  router.push(route)
  visible.value = false
}
</script>

<template>
  <div class="cash-flow-container">
    <pv-sidebar v-model:visible="visible" header="Menu" position="left">
      <div class="sidebar-menu">
        <div class="menu-item" @click="navigateTo('/the-menu')">
          <i class="pi pi-cog"></i>
          <span>Menu</span>
        </div>
        <div class="menu-item" @click="navigateTo('/the-configuration')">
          <i class="pi pi-cog"></i>
          <span>Menu</span>
        </div>
      </div>
      
    </pv-sidebar>

    <pv-button
      icon="pi pi-bars"
      @click="visible = true"
      class="sidebar-toggle-button"
      rounded
      outlined
    />
  </div>
</template>

<style scoped>
.cash-flow-container {
  font-family: "Work Sans", sans-serif;
  font-weight: 400;
  font-optical-sizing: auto;
  font-style: normal;
  display: flex;
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #0f172a 0%,
    #1e293b 25%,
    #334155 50%,
    #1e40af 75%,
    #3b82f6 100%
  );
  color: white;
  position: relative;
}

.sidebar-toggle-button {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 999;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  background-color: rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.sidebar-toggle-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.menu-item i {
  font-size: 1.2rem;
}

::v-deep(.p-sidebar) {
  transition: transform 0.4s ease, opacity 0.4s ease;
}

/* Añade un pequeño fade además del desplazamiento */
::v-deep(.p-sidebar-left) {
  transform: translateX(-100%);
  opacity: 0;
}

::v-deep(.p-sidebar.p-sidebar-active) {
  transform: translateX(0);
  opacity: 1;
}

::v-deep(.p-sidebar-mask) {
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  transition: background-color 0.4s ease;
}

</style>
