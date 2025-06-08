<script setup>
import { ref, computed } from 'vue';
import SideBar from '../../Shared/Presentation/side-bar.component.vue';

const bondData = ref({
  monto: 10000,
  interes: 5,
  plazo: 6,
  capitalizacion: 'mensual', // Nueva propiedad para la frecuencia
  usarTasaEfectiva: false, // Checkbox para alternar entre tasa efectiva y nominal
  tasaEfectivaAnual: 5 // Tasa efectiva anual cuando el checkbox está activo
});

// Opciones de capitalización
const capitalizacionOptions = ref([
  { label: 'Diaria', value: 'diaria', periodos: 365 },
  { label: 'Mensual', value: 'mensual', periodos: 12 },
  { label: 'Bimestral', value: 'bimestral', periodos: 6 },
  { label: 'Trimestral', value: 'trimestral', periodos: 4 },
  { label: 'Semestral', value: 'semestral', periodos: 2 },
  { label: 'Anual', value: 'anual', periodos: 1 }
]);

// Nuevos campos para costos adicionales
const costosAdicionales = ref({
  // Para TREA (Tasa de Rendimiento Efectivo Anual)
  costosEmisor: 0.5, // % del monto
  comisionCasaBolsa: 0.3, // % del monto
  impuestos: 0.2, // % del monto
  
  // Para TCEA (Tasa de Costo Efectivo Anual)
  costosCavali: 0.1, // % del monto
  costosEstructuracion: 0.4, // % del monto
  costosColocacion: 0.6 // % del monto
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
  duracion: 0,
  // Nuevos campos para mostrar los costos
  totalCostosTREA: 0,
  totalCostosTCEA: 0,
  tasaEfectivaPeriodo: 0,
  periodosAnio: 0
});

// Función para obtener los períodos por año según la capitalización
const getPeriodosAnio = (capitalizacion) => {
  const opcion = capitalizacionOptions.value.find(opt => opt.value === capitalizacion);
  return opcion ? opcion.periodos : 12;
};

// Función para convertir tasa nominal anual a tasa efectiva del período
const getTasaEfectivaPeriodo = (tasaAnual, capitalizacion, usarTasaEfectiva = false) => {
  const tasa = tasaAnual / 100;
  
  if (usarTasaEfectiva) {
    // Si se usa tasa efectiva anual, convertir directamente al período de pago
    const periodosPago = bondData.value.capitalizacion === 'mensual' ? 12 : 
                        bondData.value.capitalizacion === 'bimestral' ? 6 :
                        bondData.value.capitalizacion === 'trimestral' ? 4 :
                        bondData.value.capitalizacion === 'semestral' ? 2 :
                        bondData.value.capitalizacion === 'anual' ? 1 : 
                        bondData.value.capitalizacion === 'diaria' ? 365 : 12;
    
    return Math.pow(1 + tasa, 1 / periodosPago) - 1;
  } else {
    // Si se usa tasa nominal, convertir primero a efectiva anual, luego al período
    const periodosAnio = getPeriodosAnio(capitalizacion);
    const tasaEfectivaAnual = Math.pow(1 + tasa / periodosAnio, periodosAnio) - 1;
    
    const periodosPago = bondData.value.capitalizacion === 'mensual' ? 12 : 
                        bondData.value.capitalizacion === 'bimestral' ? 6 :
                        bondData.value.capitalizacion === 'trimestral' ? 4 :
                        bondData.value.capitalizacion === 'semestral' ? 2 :
                        bondData.value.capitalizacion === 'anual' ? 1 : 
                        bondData.value.capitalizacion === 'diaria' ? 365 : 12;
    
    return Math.pow(1 + tasaEfectivaAnual, 1 / periodosPago) - 1;
  }
};

// Función para obtener el número de períodos de pago
const getPeriodosPago = (plazoMeses, capitalizacion) => {
  switch(capitalizacion) {
    case 'diaria':
      return Math.round(plazoMeses * 30.44); // Aproximadamente 30.44 días por mes
    case 'mensual':
      return plazoMeses;
    case 'bimestral':
      return Math.round(plazoMeses / 2);
    case 'trimestral':
      return Math.round(plazoMeses / 3);
    case 'semestral':
      return Math.round(plazoMeses / 6);
    case 'anual':
      return Math.round(plazoMeses / 12);
    default:
      return plazoMeses;
  }
};

const calcularCuotaFrancesa = (capital, tasa, periodos) => {
  if (tasa === 0) return capital / periodos;
  const factor = Math.pow(1 + tasa, periodos);
  return (capital * tasa * factor) / (factor - 1);
};

const calculateCashFlow = () => {
  const monto = parseFloat(bondData.value.monto) || 0;
  const tasaAnual = bondData.value.usarTasaEfectiva ? 
                   parseFloat(bondData.value.tasaEfectivaAnual) || 0 :
                   parseFloat(bondData.value.interes) || 0;
  const plazoMeses = parseInt(bondData.value.plazo) || 0;
  const capitalizacion = bondData.value.capitalizacion;
  const usarTasaEfectiva = bondData.value.usarTasaEfectiva;

  if (monto <= 0 || tasaAnual < 0 || plazoMeses <= 0 || plazoMeses > 1200) {
    alert('Por favor ingrese valores válidos');
    return;
  }

  // Calcular tasa efectiva del período de pago
  const tasaEfectivaPeriodo = getTasaEfectivaPeriodo(tasaAnual, capitalizacion, usarTasaEfectiva);
  const periodosPago = getPeriodosPago(plazoMeses, capitalizacion);
  const periodosAnio = getPeriodosAnio(capitalizacion);

  // Actualizar métricas básicas
  metrics.value.tasaEfectivaPeriodo = tasaEfectivaPeriodo;
  metrics.value.periodosAnio = periodosAnio;
  
  let flujo = [];
  let saldoPendiente = monto;

  const cuotaFrancesa = calcularCuotaFrancesa(saldoPendiente, tasaEfectivaPeriodo, periodosPago);

  for (let i = 0; i < periodosPago; i++) {
    const periodo = i + 1;
    const saldoInicial = saldoPendiente;
    const interes = saldoPendiente * tasaEfectivaPeriodo;
    let cuota = cuotaFrancesa;
    let amortizacion = cuota - interes;

    // Ajustar última cuota si es necesario
    if (i === periodosPago - 1) {
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
  const tasaAnual = bondData.value.usarTasaEfectiva ? 
                   parseFloat(bondData.value.tasaEfectivaAnual) / 100 :
                   parseFloat(bondData.value.interes) / 100;
  const flujos = cashFlowData.value;
  const capitalizacion = bondData.value.capitalizacion;

  if (flujos.length === 0) return;

  const tasaEfectivaPeriodo = metrics.value.tasaEfectivaPeriodo;
  const periodosAnio = metrics.value.periodosAnio;
  
  // Calcular costos totales
  const totalCostosTREA = (
    (costosAdicionales.value.costosEmisor / 100) +
    (costosAdicionales.value.comisionCasaBolsa / 100) +
    (costosAdicionales.value.impuestos / 100)
  ) * monto;
  
  const totalCostosTCEA = (
    (costosAdicionales.value.costosCavali / 100) +
    (costosAdicionales.value.costosEstructuracion / 100) +
    (costosAdicionales.value.costosColocacion / 100)
  ) * monto;

  metrics.value.totalCostosTREA = totalCostosTREA;
  metrics.value.totalCostosTCEA = totalCostosTCEA;

  // TCEA - Tasa de Costo Efectivo Anual (incluye costos del inversionista)
  const montoNetoTCEA = monto + totalCostosTCEA;
  const periodosPago = flujos.length;
  const tasaEfectivaTCEA = Math.pow(montoNetoTCEA / monto, periodosAnio / periodosPago) - 1;
  metrics.value.tasaCostoEfectivoAnual = parseFloat(tasaEfectivaTCEA.toFixed(4));

  // TREA - Tasa de Rendimiento Efectivo Anual (incluye costos del emisor)
  const montoNetoTREA = monto - totalCostosTREA;
  let valorPresenteIngresos = 0;
  
  flujos.forEach((flujo, index) => {
    const periodo = index + 1;
    const flujoEfectivo = flujo.cuota;
    valorPresenteIngresos += flujoEfectivo / Math.pow(1 + tasaEfectivaPeriodo, periodo);
  });
  
  // Calcular TREA usando TIR ajustada por costos
  const tasaEfectivaTREA = Math.pow(valorPresenteIngresos / montoNetoTREA, periodosAnio / periodosPago) - 1;
  metrics.value.tasaRendimientoEfectivoAnual = parseFloat(tasaEfectivaTREA.toFixed(4));

  // Duración (ajustada por frecuencia de capitalización)
  let duracion = 0;
  let valorPresente = 0;
  
  flujos.forEach((flujo, index) => {
    const periodo = index + 1;
    const flujoEfectivo = flujo.cuota;
    const vp = flujoEfectivo / Math.pow(1 + tasaEfectivaPeriodo, periodo);
    duracion += (periodo * vp);
    valorPresente += vp;
  });
  
  metrics.value.duracion = parseFloat((duracion / valorPresente / periodosAnio).toFixed(4));

  // Convexidad (ajustada por frecuencia de capitalización)
  let convexidad = 0;
  flujos.forEach((flujo, index) => {
    const periodo = index + 1;
    const flujoEfectivo = flujo.cuota;
    const vp = flujoEfectivo / Math.pow(1 + tasaEfectivaPeriodo, periodo);
    convexidad += (periodo * (periodo + 1) * vp);
  });
  
  metrics.value.convexidad = parseFloat((convexidad / (valorPresente * Math.pow(1 + tasaEfectivaPeriodo, 2)) / Math.pow(periodosAnio, 2)).toFixed(4));
};

const updateGracePeriod = (rowData, newValue) => {
  rowData.plazoGracia = newValue;
  calculateCashFlow();
};

// Computed para mostrar información adicional sobre la capitalización
const capitalizacionInfo = computed(() => {
  const opcion = capitalizacionOptions.value.find(opt => opt.value === bondData.value.capitalizacion);
  if (!opcion) return '';
  
  const tasaInput = bondData.value.usarTasaEfectiva ? 
                   bondData.value.tasaEfectivaAnual : 
                   bondData.value.interes;
  const tasaEfectiva = getTasaEfectivaPeriodo(tasaInput, bondData.value.capitalizacion, bondData.value.usarTasaEfectiva);
  const periodos = getPeriodosPago(bondData.value.plazo, bondData.value.capitalizacion);
  
  const tipoTasa = bondData.value.usarTasaEfectiva ? 'Efectiva Anual' : 'Nominal Anual';
  
  return `Tasa ${tipoTasa}: ${tasaInput}% | Tasa efectiva por período: ${(tasaEfectiva * 100).toFixed(4)}% | Períodos de pago: ${periodos}`;
});

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
            <label for="plazo">Plazo del bono (meses)</label>
            <pv-input-text 
              id="plazo" 
              v-model="bondData.plazo" 
              type="number"
              placeholder="6" 
              @input="calculateCashFlow" />
          </div>
          
          <!-- Checkbox para alternar entre tasa efectiva y nominal -->
          <div class="input-group checkbox-group">
            <div class="checkbox-container">
              <pv-checkbox 
                id="usarTasaEfectiva" 
                v-model="bondData.usarTasaEfectiva" 
                :binary="true"
                @change="calculateCashFlow" />
              <label for="usarTasaEfectiva">Usar Tasa Efectiva Anual</label>
            </div>
          </div>
        </div>
        
        <!-- Inputs condicionales para tasa -->
        <div class="rate-section">
          <!-- Mostrar solo cuando se usa tasa efectiva -->
          <div v-if="bondData.usarTasaEfectiva" class="input-group">
            <label for="tasaEfectivaAnual">Tasa Efectiva Anual (%)</label>
            <pv-input-text 
              id="tasaEfectivaAnual" 
              v-model="bondData.tasaEfectivaAnual" 
              type="number"
              step="0.01"
              placeholder="5.0" 
              @input="calculateCashFlow" />
          </div>
          
          <!-- Mostrar solo cuando se usa tasa nominal -->
          <div v-else class="rate-inputs-group">
            <div class="input-group">
              <label for="interes">Tasa Nominal Anual (%)</label>
              <pv-input-text 
                id="interes" 
                v-model="bondData.interes" 
                type="number"
                step="0.01"
                placeholder="5.0" 
                @input="calculateCashFlow" />
            </div>
            
            <div class="input-group">
              <label for="capitalizacion">Frecuencia de Capitalización</label>
              <pv-dropdown
                id="capitalizacion"
                v-model="bondData.capitalizacion"
                :options="capitalizacionOptions"
                option-label="label"
                option-value="value"
                @update:modelValue="calculateCashFlow"
                class="w-full"
                placeholder="Seleccionar frecuencia"
              />
            </div>
          </div>
        </div>
        
        <div class="capitalization-info" v-if="capitalizacionInfo">
          <p><strong>Información de Capitalización:</strong> {{ capitalizacionInfo }}</p>
        </div>
      </div>

      <!-- Nueva sección para costos adicionales -->
      <div class="costs-section">
        <h2>Costos Adicionales (% del monto)</h2>
        
        <div class="costs-grid">
          <div class="cost-group">
            <h3>Para TREA (Tasa de Rendimiento)</h3>
            <div class="cost-inputs">
              <div class="input-group">
                <label for="costosEmisor">Costos del Emisor (%)</label>
                <pv-input-text 
                  id="costosEmisor" 
                  v-model="costosAdicionales.costosEmisor" 
                  type="number"
                  step="0.01"
                  placeholder="0.5" 
                  @input="calculateCashFlow" />
              </div>
              
              <div class="input-group">
                <label for="comisionCasaBolsa">Comisión Casa de Bolsa (%)</label>
                <pv-input-text 
                  id="comisionCasaBolsa" 
                  v-model="costosAdicionales.comisionCasaBolsa" 
                  type="number"
                  step="0.01"
                  placeholder="0.3" 
                  @input="calculateCashFlow" />
              </div>
              
              <div class="input-group">
                <label for="impuestos">Impuestos (%)</label>
                <pv-input-text 
                  id="impuestos" 
                  v-model="costosAdicionales.impuestos" 
                  type="number"
                  step="0.01"
                  placeholder="0.2" 
                  @input="calculateCashFlow" />
              </div>
            </div>
          </div>
          
          <div class="cost-group">
            <h3>Para TCEA (Tasa de Costo)</h3>
            <div class="cost-inputs">
              <div class="input-group">
                <label for="costosCavali">Costos CAVALI (%)</label>
                <pv-input-text 
                  id="costosCavali" 
                  v-model="costosAdicionales.costosCavali" 
                  type="number"
                  step="0.01"
                  placeholder="0.1" 
                  @input="calculateCashFlow" />
              </div>
              
              <div class="input-group">
                <label for="costosEstructuracion">Costos de Estructuración (%)</label>
                <pv-input-text 
                  id="costosEstructuracion" 
                  v-model="costosAdicionales.costosEstructuracion" 
                  type="number"
                  step="0.01"
                  placeholder="0.4" 
                  @input="calculateCashFlow" />
              </div>
              
              <div class="input-group">
                <label for="costosColocacion">Costos de Colocación (%)</label>
                <pv-input-text 
                  id="costosColocacion" 
                  v-model="costosAdicionales.costosColocacion" 
                  type="number"
                  step="0.01"
                  placeholder="0.6" 
                  @input="calculateCashFlow" />
              </div>
            </div>
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
          <div class="metric-card tcea">
            <div class="metric-label">TCEA - Tasa de Costo Efectivo Anual</div>
            <div class="metric-value">{{ (metrics.tasaCostoEfectivoAnual * 100).toFixed(2) }}%</div>
            <div class="metric-detail">
              Costos incluidos: S/ {{ metrics.totalCostosTCEA.toLocaleString('es-PE', { minimumFractionDigits: 2 }) }}
            </div>
          </div>
          
          <div class="metric-card trea">
            <div class="metric-label">TREA - Tasa de Rendimiento Efectivo Anual</div>
            <div class="metric-value">{{ (metrics.tasaRendimientoEfectivoAnual * 100).toFixed(2) }}%</div>
            <div class="metric-detail">
              Costos incluidos: S/ {{ metrics.totalCostosTREA.toLocaleString('es-PE', { minimumFractionDigits: 2 }) }}
            </div>
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

.capitalization-info {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-left: 4px solid #007bff;
  border-radius: 0.25rem;
}

.capitalization-info p {
  margin: 0;
  color: #495057;
  font-size: 0.9rem;
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

.input-section, .costs-section {
  margin-bottom: 2rem;
  background: rgba(15, 23, 42, 0.7);
  padding: 1.5rem;
  border-radius: 16px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.input-section h2, .costs-section h2 {
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

.costs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 1rem;
}

.cost-group {
  background: rgba(30, 41, 59, 0.5);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.1);
}

.cost-group h3 {
  color: #60a5fa;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
  border-bottom: 1px solid rgba(59, 130, 246, 0.3);
  padding-bottom: 0.5rem;
}

.cost-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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

.metric-card.tcea {
  border-color: rgba(239, 68, 68, 0.5);
}

.metric-card.trea {
  border-color: rgba(34, 197, 94, 0.5);
}

.metric-card.tcea:hover {
  border-color: rgba(239, 68, 68, 0.7);
  box-shadow: 0 8px 30px rgba(239, 68, 68, 0.2);
}

.metric-card.trea:hover {
  border-color: rgba(34, 197, 94, 0.7);
  box-shadow: 0 8px 30px rgba(34, 197, 94, 0.2);
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
  margin-bottom: 0.5rem;
}

.metric-card.tcea .metric-value {
  color: #f87171;
}

.metric-card.trea .metric-value {
  color: #4ade80;
}

.metric-detail {
  font-size: 0.8rem;
  color: #64748b;
  font-style: italic;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(30, 41, 59, 0.5);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-container label {
  color: #e2e8f0;
  font-size: 0.95rem;
  font-weight: 500;
}

/* Tasa input específico */
.rate-section .input-group {
  background: rgba(30, 41, 59, 0.5);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.rate-section .input-group:hover {
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.2);
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

@media (max-width: 1024px) {
  .costs-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .input-grid {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .costs-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    text-align: center;
    align-self: center;
    font-size: 1.2rem;
  }
  
  .cost-inputs {
    gap: 0.75rem;
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
.costs-section,
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

.cost-group {
  animation: fadeInUp 0.6s ease-out;
  animation-delay: 0.15s;
  animation-fill-mode: both;
}

</style>