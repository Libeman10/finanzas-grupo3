<script setup>
import TheHeader from './the-header.component.vue';
</script>

<template>
  <div class="home-container">
    <TheHeader />
    
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1>Simulador de Bonos Corporativos – Método Francés</h1>
          <p>
            Este sistema permite calcular el flujo de caja 
            de un bono corporativo utilizando 
            exclusivamente el método francés de 
            amortización
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.hero-section {
  flex: 1;
  background-image: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFcZt2r-bnLFg5eI4o5cxxTE_WdH_CkRDgvA&s');
  background-size: cover;
  background-position: center;
  position: relative;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7); /* Darkened overlay */
}

.hero-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.hero-text {
  max-width: 600px;
  text-align: center;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 2rem;
  border-radius: 8px;
}

.hero-text h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.hero-text p {
  font-size: 1.2rem;
  line-height: 1.6;
}
</style>