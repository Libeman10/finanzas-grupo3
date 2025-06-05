<script setup>
import { ref, computed } from 'vue';
import SideBar from '../../Shared/Presentation/side-bar.component.vue';

const bondData = ref({
  monto: 10000,
  interes: 5,
  plazo: 6
});

const cashFlowData = ref([]);

const gracePeriodOptions = ref([
  { label: 'Normal', value: 'N' },
  { label: 'Parcial', value: 'P' },
  { label: 'Total', value: 'T' }
]);

const metrics = ref({
  tasaCostoEfectivoAnual: 0,
  tasaRendimientoEfectivoAnual: 0,
  convexidad: 0,
  duracion: 0
});

const calcularCuotaFrancesa = (capital, tasa, periodos) => {
  if (tasa === 0) return capital / periodos;
  const factor = Math.pow(1 + tasa, periodos);
  return (capital * tasa * factor) / (factor - 1);
};

const calculateCashFlow = () => {
  const monto = parseFloat(bondData.value.monto) || 0;
  const tasaAnual = parseFloat(bondData.value.interes) / 100 || 0;
  const plazo = parseInt(bondData.value.plazo) || 0;

  if (monto <= 0 || tasaAnual < 0 || plazo <= 0 || plazo > 100) {
    alert('Por favor ingrese valores válidos');
    return;
  }

  const tasaPeriodica = tasaAnual / 12;
  
  let flujo = [];
  let saldoPendiente = monto;

  const cuotaFrancesa = calcularCuotaFrancesa(saldoPendiente, tasaPeriodica, plazo);

  for (let i = 0; i < plazo; i++) {
    const periodo = i + 1;
    const saldoInicial = saldoPendiente;
    const interes = saldoPendiente * tasaPeriodica;
    let cuota = cuotaFrancesa;
    let amortizacion = cuota - interes;

    // Ajustar última cuota si es necesario
    if (i === plazo - 1) {
      amortizacion = saldoPendiente;
      cuota = amortizacion + interes;
    }

    saldoPendiente -= amortizacion;

    const plazosGraciaActuales = cashFlowData.value.map(f => f.plazoGracia);

    const plazoGracia = plazosGraciaActuales[i] || 'N';


    if (plazoGracia === 'T') {
      cuota = 0;
      amortizacion = 0;
      saldoPendiente = saldoInicial + interes;
    } else if (plazoGracia === 'P') {
      cuota = interes;
      amortizacion = 0;
      saldoPendiente = saldoInicial;
    }

    flujo.push({
      no: periodo,
      saldoInicial: parseFloat(saldoInicial.toFixed(2)),
      interes: parseFloat(interes.toFixed(2)),
      cuota: parseFloat(cuota.toFixed(2)),
      amortizacion: parseFloat(amortizacion.toFixed(2)),
      saldoFinal: parseFloat(Math.max(0, saldoPendiente).toFixed(2)),
      plazoGracia
    });
  }

  cashFlowData.value = flujo;
  calcularMetricas();
};

const calcularMetricas = () => {
  const monto = parseFloat(bondData.value.monto);
  const tasaAnual = parseFloat(bondData.value.interes) / 100;
  const flujos = cashFlowData.value;

  if (flujos.length === 0) return;

  const tasaMensual = tasaAnual / 12;
  metrics.value.tasaCostoEfectivoAnual = parseFloat((Math.pow(1 + tasaMensual, 12) - 1).toFixed(4));

  metrics.value.tasaRendimientoEfectivoAnual = metrics.value.tasaCostoEfectivoAnual;

  let duracion = 0;
  let valorPresente = 0;
  
  flujos.forEach((flujo, index) => {
    const periodo = index + 1;
    const flujoEfectivo = flujo.cuota;
    const vp = flujoEfectivo / Math.pow(1 + tasaMensual, periodo);
    duracion += (periodo * vp);
    valorPresente += vp;
  });
  
  metrics.value.duracion = parseFloat((duracion / valorPresente / 12).toFixed(4)); 


  let convexidad = 0;
  flujos.forEach((flujo, index) => {
    const periodo = index + 1;
    const flujoEfectivo = flujo.cuota;
    const vp = flujoEfectivo / Math.pow(1 + tasaMensual, periodo);
    convexidad += (periodo * (periodo + 1) * vp);
  });
  
  metrics.value.convexidad = parseFloat((convexidad / (valorPresente * Math.pow(1 + tasaMensual, 2)) / 144).toFixed(4)); 
};

const updateGracePeriod = (rowData, newValue) => {
  rowData.plazoGracia = newValue;
  calculateCashFlow();
};

calculateCashFlow();
</script>

<template>
  <div class="cash-flow-container">
    <SideBar />
    
    <div class="content">
      <h1 class="page-title">Calculadora de Bonos - BonosAlFallo</h1>
      
      <div class="input-section">
        <h2>Datos de entrada</h2>
        
        <div class="input-grid">
          <div class="input-group">
            <label for="monto">Monto del bono</label>
            <pv-input-text 
              id="monto" 
              v-model="bondData.monto" 
              type="number"
              placeholder="10000" />
          </div>
          
          <div class="input-group">
            <label for="interes">Interés (%)</label>
            <pv-input-text 
              id="interes" 
              v-model="bondData.interes" 
              type="number"
              step="0.01"
              placeholder="5.0" />
          </div>
          
          <div class="input-group">
            <label for="plazo">Plazo de bono (meses)</label>
            <pv-input-text 
              id="plazo" 
              v-model="bondData.plazo" 
              type="number"
              placeholder="6" />
          </div>
        </div>
        
        <div class="calculate-button-container">
          <pv-button 
            label="Calcular Flujo de Caja" 
            @click="calculateCashFlow" 
            class="calculate-button" 
            icon="pi pi-calculator" />
        </div>
      </div>

      <div class="table-container">
        <h3>Flujo de Caja</h3>
        <pv-data-table 
          :value="cashFlowData" 
          showGridlines 
          :scrollable="true"
          scrollHeight="400px"
          tableStyle="min-width: 50rem"
          class="p-datatable-gridlines">
          <pv-column field="no" header="N°" style="min-width: 60px"></pv-column>
          <pv-column field="saldoInicial" header="Saldo inicial" style="min-width: 120px">
            <template #body="slotProps">
              {{ slotProps.data.saldoInicial.toLocaleString('es-PE', { 
                style: 'currency', 
                currency: 'PEN',
                minimumFractionDigits: 2 
              }) }}
            </template>
          </pv-column>
          <pv-column field="interes" header="Interés" style="min-width: 100px">
            <template #body="slotProps">
              {{ slotProps.data.interes.toLocaleString('es-PE', { 
                style: 'currency', 
                currency: 'PEN',
                minimumFractionDigits: 2 
              }) }}
            </template>
          </pv-column>
          <pv-column field="cuota" header="Cuota" style="min-width: 100px">
            <template #body="slotProps">
              {{ slotProps.data.cuota.toLocaleString('es-PE', { 
                style: 'currency', 
                currency: 'PEN',
                minimumFractionDigits: 2 
              }) }}
            </template>
          </pv-column>
          <pv-column field="amortizacion" header="Amortización" style="min-width: 120px">
            <template #body="slotProps">
              {{ slotProps.data.amortizacion.toLocaleString('es-PE', { 
                style: 'currency', 
                currency: 'PEN',
                minimumFractionDigits: 2 
              }) }}
            </template>
          </pv-column>
          <pv-column field="saldoFinal" header="Saldo final" style="min-width: 120px">
            <template #body="slotProps">
              {{ slotProps.data.saldoFinal.toLocaleString('es-PE', { 
                style: 'currency', 
                currency: 'PEN',
                minimumFractionDigits: 2 
              }) }}
            </template>
          </pv-column>
            <pv-column field="plazoGracia" header="Plazo de gracia" style="min-width: 150px">
            <template #body="slotProps">
              <pv-dropdown
                v-model="slotProps.data.plazoGracia"
                :options="gracePeriodOptions"
                option-label="label"
                option-value="value"
                @update:modelValue="(newValue) => updateGracePeriod(slotProps.data, newValue)"
                class="w-full"
                placeholder="Seleccionar"
              />
            </template>
          </pv-column>
        </pv-data-table>
      </div>

      <div class="metrics-container" v-if="cashFlowData.length > 0">
        <h3>Métricas Financieras</h3>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">Tasa de Costo Efectivo Anual</div>
            <div class="metric-value">{{ (metrics.tasaCostoEfectivoAnual * 100).toFixed(2) }}%</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-label">Tasa de Rendimiento Efectivo Anual</div>
            <div class="metric-value">{{ (metrics.tasaRendimientoEfectivoAnual * 100).toFixed(2) }}%</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-label">Duración (años)</div>
            <div class="metric-value">{{ metrics.duracion.toFixed(4) }}</div>
          </div>
          
          <div class="metric-card">
            <div class="metric-label">Convexidad</div>
            <div class="metric-value">{{ metrics.convexidad.toFixed(4) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap');

.cash-flow-container {
  font-family: "Work Sans", sans-serif;
  font-weight: 400;
  font-optical-sizing: auto;
  font-weight: weight;
  font-style: normal;
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e40af 75%, #3b82f6 100%);
  color: white;
}

.content {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.page-title {
  text-align: right;
  margin-bottom: 2rem;
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

.input-section {
  margin-bottom: 2rem;
  background: rgba(15, 23, 42, 0.7);
  padding: 1.5rem;
  border-radius: 16px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.input-section h2 {
  margin-bottom: 1rem;
  color: #e2e8f0;
  font-size: 1.3rem;
  font-weight: 600;
}

.input-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: 600;
  color: #cbd5e1;
  font-size: 0.95rem;
}

.calculate-button-container {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.calculate-button {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: 1px solid rgba(59, 130, 246, 0.5);
  color: white;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.calculate-button:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.table-container {
  margin-top: 2rem;
  background: rgba(15, 23, 42, 0.7);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.table-container h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #e2e8f0;
  border-bottom: 2px solid rgba(59, 130, 246, 0.4);
  padding-bottom: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.metrics-container {
  margin-top: 2rem;
  background: rgba(15, 23, 42, 0.7);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.metrics-container h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #e2e8f0;
  border-bottom: 2px solid rgba(59, 130, 246, 0.4);
  padding-bottom: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.metric-card {
  background: rgba(30, 41, 59, 0.8);
  color: #e2e8f0;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.metric-card:hover {
  transform: translateY(-5px);
  background: rgba(30, 41, 59, 0.9);
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.2);
}

.metric-label {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #94a3b8;
}

.metric-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #60a5fa;
}

/* Estilos para PrimeVue */
:deep(.p-datatable) {
  background: rgba(15, 23, 42, 0.8);
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: rgba(30, 41, 59, 0.9);
  color: #e2e8f0;
  text-align: center;
  border: 1px solid rgba(59, 130, 246, 0.3);
  position: sticky;
  top: 0;
  z-index: 1;
  font-weight: 600;
  padding: 0.75rem;
  backdrop-filter: blur(15px);
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  border: 1px solid rgba(59, 130, 246, 0.2);
  text-align: center;
  padding: 0.75rem;
  color: #cbd5e1;
}

:deep(.p-datatable .p-datatable-tbody > tr:nth-child(even)) {
  background: rgba(30, 41, 59, 0.3);
}

:deep(.p-datatable .p-datatable-tbody > tr:nth-child(odd)) {
  background: rgba(15, 23, 42, 0.4);
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background: rgba(59, 130, 246, 0.2);
}

:deep(.p-selectbutton) {
  display: flex;
  width: 100%;
}

:deep(.p-selectbutton .p-button) {
  flex: 1;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #cbd5e1;
  backdrop-filter: blur(5px);
  margin: 0;
  font-weight: 500;
}

:deep(.p-selectbutton .p-button:not(:first-child)) {
  border-left: none;
}

:deep(.p-selectbutton .p-button:first-child) {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

:deep(.p-selectbutton .p-button:last-child) {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

:deep(.p-selectbutton .p-button:hover) {
  background: rgba(59, 130, 246, 0.3);
  color: white;
  z-index: 1;
}

:deep(.p-selectbutton .p-button.p-highlight) {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

:deep(.p-inputtext) {
  border-radius: 8px;
  border: 1px solid rgba(59, 130, 246, 0.3);
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.8);
  color: #e2e8f0;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

:deep(.p-inputtext::placeholder) {
  color: rgba(148, 163, 184, 0.7);
}

:deep(.p-inputtext:focus) {
  border-color: rgba(59, 130, 246, 0.6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  background: rgba(15, 23, 42, 0.9);
  outline: none;
}

:deep(.p-dropdown) {
  border-radius: 8px;
  border: 1px solid rgba(59, 130, 246, 0.3);
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  color: #e2e8f0;
}

:deep(.p-dropdown:hover) {
  border-color: rgba(59, 130, 246, 0.5);
}

:deep(.p-dropdown:focus) {
  border-color: rgba(59, 130, 246, 0.6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

:deep(.p-calendar) {
  border-radius: 8px;
}

/* Scrollbar personalizada */
:deep(.p-datatable-scrollable-body::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}

:deep(.p-datatable-scrollable-body::-webkit-scrollbar-track) {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 4px;
}

:deep(.p-datatable-scrollable-body::-webkit-scrollbar-thumb) {
  background: rgba(59, 130, 246, 0.5);
  border-radius: 4px;
}

:deep(.p-datatable-scrollable-body::-webkit-scrollbar-thumb:hover) {
  background: rgba(59, 130, 246, 0.7);
}

@media (max-width: 768px) {
  .input-grid {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    text-align: center;
    align-self: center;
    font-size: 1.2rem;
  }
}

/* Animaciones adicionales */
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

.input-section,
.table-container,
.metrics-container {
  animation: fadeInUp 0.6s ease-out;
}

.metric-card {
  animation: fadeInUp 0.6s ease-out;
  animation-delay: 0.1s;
  animation-fill-mode: both;
}

.metric-card:nth-child(2) {
  animation-delay: 0.2s;
}

.metric-card:nth-child(3) {
  animation-delay: 0.3s;
}

.metric-card:nth-child(4) {
  animation-delay: 0.4s;
}
</style>