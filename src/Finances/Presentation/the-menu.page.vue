<template>
  <div class="menu-container">
    <div class="page-title">Calculadora de Bonos - BonosAlFallo</div>

    <pv-toolbar class="toolbar-container">
      <template #start>
        <h2 class="toolbar-title">
          Mis Calculadoras ({{ calculators.length }})
        </h2>
      </template>
      <template #end>
        <div class="toolbar-buttons">
          <pv-button
            @click="addNewCalculator"
            icon="pi pi-plus"
            label="Nueva Calculadora"
            class="p-button-success"
            raised
          />
          <pv-button
            @click="logout"
            icon="pi pi-sign-out"
            label="Cerrar sesión"
            class="p-button-secondary"
            raised
          />
        </div>
      </template>
    </pv-toolbar>

    <div v-if="calculators.length > 0" class="calculators-grid">
      <div
        v-for="calculator in calculators"
        :key="calculator.id"
        class="calculator-card-wrapper"
      >
        <pv-card class="calculator-card">
          <template #title>
            <div class="card-header">
              <i class="pi pi-calculator card-icon"></i>
              <span>{{ calculator.name || "Sin nombre" }}</span>
            </div>
          </template>

          <template #subtitle>
            <div class="card-date">
              <i class="pi pi-calendar"></i>
              <span>{{ formatDate(calculator.createdAt) }}</span>
            </div>
          </template>

          <template #content>
            <div class="card-stats">
              <div class="stat-item">
                <span class="stat-label">ID:</span>
                <span class="stat-value">#{{ calculator.id }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Estado:</span>
                <span class="stat-value status-active">Activa</span>
              </div>
            </div>
          </template>

          <template #footer>
            <div class="card-actions">
              <pv-button
                @click="goToCashFlow(calculator.id)"
                icon="pi pi-arrow-right"
                label="Ir a Cash Flow"
                class="p-button-primary"
                size="small"
              />
              <pv-button
                @click="deleteCalculator(calculator.id)"
                icon="pi pi-trash"
                class="p-button-danger p-button-outlined"
                size="small"
              />
            </div>
          </template>
        </pv-card>
      </div>
    </div>

    <div v-else class="empty-state">
      <i class="pi pi-calculator empty-icon"></i>
      <h3>No hay calculadoras creadas</h3>
      <p>
        Haz clic en "Nueva Calculadora" para crear tu primera calculadora de
        bonos
      </p>
      <pv-button
        @click="addNewCalculator"
        icon="pi pi-plus"
        label="Crear Primera Calculadora"
        class="p-button-success"
        raised
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "CalculadoraMenu",
  data() {
    return {
      calculators: [],
      showDebug: false,
    };
  },
  mounted() {
    this.loadCalculators();
  },
  methods: {
    logout() {
      localStorage.removeItem("currentCalculatorId");
      localStorage.removeItem("calculators");

      if (this.$router) {
        this.$router.push({ name: "home" });
      } else {
        window.location.href = "/";
      }
    },

    addNewCalculator() {
      const newCalculator = {
        id: Date.now(),
        name: `Calculadora ${this.calculators.length + 1}`,
        createdAt: new Date(),
      };

      this.calculators.push(newCalculator);
      this.saveCalculators();
    },

    goToCashFlow(calculatorId) {
      // Guardar el ID de la calculadora actual en localStorage
      localStorage.setItem("currentCalculatorId", calculatorId);

      if (this.$router) {
        this.$router.push({
          name: "CashFlow",
          params: { id: calculatorId },
        });
      } else {
        window.location.href = `/cash-flow?id=${calculatorId}`;
      }
    },

    downloadExcel(calculatorId) {
      console.log("Descargando Excel para calculadora:", calculatorId);
      alert(
        `Función de descarga Excel para calculadora ${calculatorId} - Por implementar`
      );
    },

    deleteCalculator(calculatorId) {
      console.log("Eliminando calculadora:", calculatorId);

      if (confirm("¿Estás seguro de que quieres eliminar esta calculadora?")) {
        this.calculators = this.calculators.filter(
          (calc) => calc.id !== calculatorId
        );
        this.saveCalculators();
        console.log("Calculadora eliminada. Lista actual:", this.calculators);
      }
    },

    saveCalculators() {
      try {
        const json = JSON.stringify(this.calculators);
        localStorage.setItem("calculators", json);
        console.log("Calculadoras guardadas en localStorage");
      } catch (error) {
        console.error("Error guardando calculadoras:", error);
      }
    },

    loadCalculators() {
      try {
        const json = localStorage.getItem("calculators");
        console.log("JSON cargado de localStorage:", json);

        if (json) {
          const loaded = JSON.parse(json);
          this.calculators = loaded.map((c) => ({
            ...c,
            createdAt: new Date(c.createdAt),
          }));
          console.log("Calculadoras cargadas:", this.calculators);
        } else {
          console.log("No hay calculadoras guardadas");
          this.calculators = [];
        }
      } catch (error) {
        console.error("Error cargando calculadoras:", error);
        this.calculators = [];
      }
    },

    formatDate(date) {
      try {
        if (!(date instanceof Date)) {
          date = new Date(date);
        }

        if (isNaN(date.getTime())) {
          return "Fecha inválida";
        }

        return date.toLocaleDateString("es-PE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch (error) {
        console.error("Error formateando fecha:", error);
        return "Fecha inválida";
      }
    },
  },
};
</script>

<style scoped>
.menu-container {
  font-family: "Work Sans", sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #0f172a 0%,
    #1e293b 25%,
    #334155 50%,
    #1e40af 75%,
    #3b82f6 100%
  );
  padding: 2rem;
  color: #e2e8f0;
}

.page-title {
  text-align: right;
  margin-bottom: 2rem;
  background: rgba(30, 41, 59, 0.8);
  color: #e2e8f0;
  padding: 1rem 2rem;
  border-radius: 12px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(59, 130, 246, 0.3);
  font-size: 1.5rem;
  font-weight: bold;
  align-self: flex-end;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.toolbar-container {
  background: rgba(15, 23, 42, 0.7);
  padding: 1rem 1.5rem;
  border-radius: 16px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
}

.toolbar-title {
  color: #e2e8f0;
  font-size: 1.3rem;
  font-weight: 600;
}

.calculators-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.calculator-card-wrapper {
  animation: fadeInUp 0.6s ease-out;
}

.calculator-card {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  color: #e2e8f0;
  transition: all 0.3s ease;
}

.calculator-card:hover {
  transform: translateY(-5px);
  background: rgba(30, 41, 59, 0.9);
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  color: #60a5fa;
  border-bottom: 1px solid rgba(59, 130, 246, 0.3);
  padding-bottom: 0.5rem;
}

.card-icon {
  font-size: 1.25rem;
}

.card-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #94a3b8;
}

.card-stats {
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-label {
  font-weight: 500;
  color: #cbd5e1;
}

.stat-value {
  color: #e2e8f0;
}

.status-active {
  color: #4ade80;
  font-weight: 600;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 1rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #cbd5e1;
  background: rgba(15, 23, 42, 0.7);
  border-radius: 16px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  backdrop-filter: blur(15px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  margin-top: 2rem;
}

.empty-icon {
  font-size: 4rem;
  color: #3b82f6;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #e2e8f0;
  margin-bottom: 0.5rem;
}

.empty-state p {
  max-width: 500px;
  margin: 0 auto 1.5rem;
  color: #94a3b8;
  font-style: italic;
}

.toolbar-buttons {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .page-title {
    text-align: center;
    font-size: 1.2rem;
  }

  .calculators-grid {
    grid-template-columns: 1fr;
  }

  .card-actions {
    flex-direction: column;
  }

  .card-actions .p-button {
    width: 100%;
  }
}
</style>
