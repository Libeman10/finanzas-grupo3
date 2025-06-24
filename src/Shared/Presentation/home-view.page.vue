<script setup>
import TheHeader from "./the-header.component.vue";
</script>

<template>
  <div class="home-container">
    <TheHeader />

    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1>Simulador de Bonos Corporativos – Método Francés</h1>
          <p>
            Este sistema permite calcular el flujo de caja de un bono
            corporativo utilizando exclusivamente el método francés de
            amortización.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;600&display=swap");

.home-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: "Work Sans", sans-serif;
}

.hero-section {
  flex: 1;
  background-image: linear-gradient(
      rgba(15, 23, 42, 0.9),
      rgba(15, 23, 42, 0.8)
    ),
    url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFcZt2r-bnLFg5eI4o5cxxTE_WdH_CkRDgvA&s");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.hero-content {
  position: relative;
  z-index: 1;
  height: 100%;
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.hero-text {
  max-width: 720px;
  text-align: center;
  color: #e2e8f0;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.3);
  backdrop-filter: blur(12px);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.hero-text h1 {
  font-size: 2.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #60a5fa;
}

.hero-text p {
  font-size: 1.2rem;
  line-height: 1.7;
  color: #cbd5e1;
}
</style>
