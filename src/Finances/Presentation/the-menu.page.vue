<template>
  <div class="menu-container">
    <!-- Título de la página -->
    <div class="page-title">
      Calculadora de Bonos - BonosAlFallo
    </div>

    <!-- Toolbar con botón para agregar nueva calculadora -->
    <pv-toolbar class="toolbar-container">
      <template #start>
        <h2 class="toolbar-title">Mis Calculadoras</h2>
      </template>
      <template #end>
        <pv-button 
          @click="addNewCalculator" 
          icon="pi pi-plus" 
          label="Nueva Calculadora"
          class="p-button-success"
          raised
        />
      </template>
    </pv-toolbar>

    <!-- DataView para mostrar las calculadoras -->
    <pv-data-view 
  :value="calculators" 
  :layout="'grid'"
  :paginator="calculators.length > 6"
  :rows="6"
  class="calculators-view"
>
  <template #grid="slotProps">
    <div v-if="slotProps?.data" class="col-12 md:col-6 lg:col-4">
      <pv-card class="calculator-card">
        <template #title>
          <div class="card-header">
            <i class="pi pi-calculator card-icon"></i>
            <span>{{ slotProps.data.name || 'Sin nombre' }}</span>
          </div>
        </template>
        
        <template #subtitle>
          <div class="card-date">
            <i class="pi pi-calendar"></i>
            <span>{{ formatDate(slotProps.data.createdAt) || 'Fecha inválida' }}</span>
          </div>
        </template>
        
        <template #content>
          <div class="card-stats">
            <div class="stat-item">
              <span class="stat-label">ID:</span>
              <span class="stat-value">#{{ slotProps.data.id || '-' }}</span>
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
              icon="pi pi-file-excel" 
              label="Descargar Excel"
              class="p-button-success p-button-outlined"
              :disabled="true"
              size="small"
            />
            <pv-button 
              @click="deleteCalculator(slotProps.data.id)"
              icon="pi pi-trash" 
              label="Eliminar"
              class="p-button-danger p-button-outlined"
              size="small"
            />
          </div>
        </template>
      </pv-card>
    </div>
  </template>

  <template #empty>
    <div class="empty-state">
      <i class="pi pi-calculator empty-icon"></i>
      <h3>No hay calculadoras creadas</h3>
      <p>Haz clic en "Nueva Calculadora" para crear tu primera calculadora de bonos</p>
      <pv-button 
        @click="addNewCalculator"
        icon="pi pi-plus" 
        label="Crear Primera Calculadora"
        class="p-button-success"
        raised
      />
    </div>
  </template>
</pv-data-view>
  </div>
</template>

<script>
export default {
  
  name: "CalculadoraMenu",
  data() {
    return {
      calculators: [],
    };
  },
  mounted() {
    this.loadCalculators();
  },
  methods: {
    addNewCalculator() {
    const newCalculator = {
        id: Date.now(),
        name: `Calculadora ${this.calculators.length + 1}`,
        createdAt: new Date()
    };
    this.calculators.push(newCalculator);
    this.saveCalculators();
    },
    saveCalculators() {
      const json = JSON.stringify(this.calculators);
      localStorage.setItem("calculators", json);
    },
    loadCalculators() {
      const json = localStorage.getItem("calculators");
      if (json) {
        const loaded = JSON.parse(json);
        // Parse createdAt como Date
        this.calculators = loaded.map(c => ({
          ...c,
          createdAt: new Date(c.createdAt),
        }));
      }
    },
    formatDate(date) {
      if (!(date instanceof Date)) date = new Date(date);
      return date.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
.menu-container {
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2rem;
}

.page-title {
  text-align: right;
  margin-bottom: 0;
  background: rgba(30, 41, 59, 0.8);
  color: #e2e8f0;
  padding: 1rem;
  display: inline-block;
  align-self: flex-end;
  border-radius: 12px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(59, 130, 246, 0.3);
  font-size: 1.5rem;
  font-weight: bold;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.toolbar-container {
  width: 100%;
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(15px);
  border-radius: 12px;
}

.toolbar-title {
  color: #e2e8f0;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.calculators-view {
  width: 100%;
  max-width: 1400px;
  align-self: center;
}

:deep(.p-dataview-content) {
  background: transparent !important;
  border: none !important;
}

:deep(.p-paginator) {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page) {
  color: #e2e8f0 !important;
}

.calculator-card {
  height: 100%;
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(15px);
  transition: all 0.3s ease;
}

.calculator-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
}

:deep(.calculator-card .p-card-title) {
  color: #e2e8f0 !important;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

:deep(.calculator-card .p-card-subtitle) {
  color: #cbd5e1 !important;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

:deep(.calculator-card .p-card-content) {
  color: #e2e8f0 !important;
  padding-top: 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-icon {
  color: #3b82f6;
  font-size: 1.2rem;
}

.card-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-date i {
  color: #8b5cf6;
}

.card-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-weight: 500;
  color: #cbd5e1;
}

.stat-value {
  font-weight: 600;
  color: #e2e8f0;
}

.status-active {
  color: #22c55e !important;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.card-actions .p-button {
  flex: 1;
  min-width: 120px;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #e2e8f0;
}

.empty-icon {
  font-size: 4rem;
  color: #8b5cf6;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #e2e8f0;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.empty-state p {
  color: #cbd5e1;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.calculator-card {
  min-height: 250px;
  min-width: 300px;
  padding: 1.5rem;
}

/* Estilos para botones de PrimeVue en el contexto del fondo */
:deep(.p-button.p-button-success) {
  background: linear-gradient(135deg, #22c55e, #16a34a) !important;
  border-color: #22c55e !important;
}

:deep(.p-dataview.p-dataview-grid .p-dataview-content) {
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

:deep(.p-button.p-button-success:hover) {
  background: linear-gradient(135deg, #16a34a, #15803d) !important;
  border-color: #16a34a !important;
}

:deep(.p-button.p-button-danger.p-button-outlined) {
  color: #ef4444 !important;
  border-color: #ef4444 !important;
}

:deep(.p-button.p-button-danger.p-button-outlined:hover) {
  background: #ef4444 !important;
  color: #ffffff !important;
}

:deep(.p-button.p-button-success.p-button-outlined) {
  color: #22c55e !important;
  border-color: #22c55e !important;
}

:deep(.p-dataview-grid .p-grid) {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

@media (max-width: 768px) {
  .menu-container {
    padding: 1rem;
    align-items: stretch;
  }
  
  .page-title {
    align-self: stretch;
    text-align: center;
    font-size: 1.25rem;
  }
  
  .toolbar-title {
    font-size: 1.1rem;
  }
  
  .card-actions {
    flex-direction: column;
  }
  
  .card-actions .p-button {
    min-width: unset;
  } 
}
</style>