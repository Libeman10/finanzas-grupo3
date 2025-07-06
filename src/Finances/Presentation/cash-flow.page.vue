<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import CurrencySelector from "./currency-selector.vue";

const router = useRouter();
const selectedCurrency = ref("PEN");
const cok = ref(5);

const bondData = ref({
  monto: 10000,
  interes: 5,
  plazo: 3,
  capitalizacion: "semestral",
  usarTasaEfectiva: false,
  tasaEfectivaAnual: 5,
});

const backtomenu = () => {
  router.push({ name: "TheMenu" });
};

const montoOptions = ref([
  { label: "1,000", value: 1000 },
  { label: "2,000", value: 2000 },
  { label: "3,000", value: 3000 },
  { label: "4,000", value: 4000 },
  { label: "5,000", value: 5000 },
  { label: "6,000", value: 6000 },
  { label: "7,000", value: 7000 },
  { label: "8,000", value: 8000 },
  { label: "9,000", value: 9000 },
  { label: "10,000", value: 10000 },
]);

const capitalizacionOptions = ref([
  { label: "Semestral", value: "semestral", periodos: 2 },
]);

const costosAdicionales = ref({
  comisionCasaBolsa: 0.3,
  costosCavali: 0.052,
  costosEstructuracion: 0.1,
  costosColocacion: 0.15,
});

const cashFlowData = ref([]);

const gracePeriodOptions = ref([
  { label: "Normal", value: "N" },
  { label: "Parcial", value: "P" },
  { label: "Total", value: "T" },
]);

const metrics = ref({
  tasaCostoEfectivoAnual: 0,
  tasaRendimientoEfectivoAnual: 0,
  convexidad: 0,
  duracion: 0,
  totalCostosTREA: 0,
  totalCostosTCEA: 0,
  tasaEfectivaPeriodo: 0,
  periodosAnio: 2,
});

const validateInputData = () => {
  const monto = parseFloat(bondData.value.monto) || 0;
  const tasaAnual = bondData.value.usarTasaEfectiva
    ? parseFloat(bondData.value.tasaEfectivaAnual) || 0
    : parseFloat(bondData.value.interes) || 0;
  const plazoAnios = parseFloat(bondData.value.plazo) || 0;

  const comisionCasaBolsa =
    parseFloat(costosAdicionales.value.comisionCasaBolsa) || 0;
  const costosCavali = parseFloat(costosAdicionales.value.costosCavali) || 0;
  const costosEstructuracion =
    parseFloat(costosAdicionales.value.costosEstructuracion) || 0;
  const costosColocacion =
    parseFloat(costosAdicionales.value.costosColocacion) || 0;

  if (monto <= 0) {
    alert(
      "❌ Error en Monto del Bono\n\nPor favor seleccione un monto válido del listado disponible."
    );
    return false;
  }

  if (plazoAnios < 3 || plazoAnios > 20) {
    alert(
      "❌ Error en Plazo del Bono\n\nEl plazo debe ser mayor a 3 años y no exceder los 20 años.\nValor ingresado: " +
        plazoAnios +
        " años"
    );
    return false;
  }

  if (tasaAnual < 2.5 || tasaAnual > 8) {
    const tipoTasa = bondData.value.usarTasaEfectiva
      ? "Efectiva Anual"
      : "Nominal Anual";
    alert(
      "❌ Error en Tasa " +
        tipoTasa +
        "\n\nLa tasa debe estar entre 2.5% y 8.0%.\nValor ingresado: " +
        tasaAnual +
        "%"
    );
    return false;
  }

  if (comisionCasaBolsa < 0) {
    alert(
      "❌ Error en Comisión Casa de Bolsa\n\nLa comisión no puede ser negativa.\nValor ingresado: " +
        comisionCasaBolsa +
        "%"
    );
    return false;
  }

  if (costosCavali < 0) {
    alert(
      "❌ Error en Costos CAVALI\n\nLos costos CAVALI no pueden ser negativos.\nValor ingresado: " +
        costosCavali +
        "%"
    );
    return false;
  }

  if (costosEstructuracion < 0.1 || costosEstructuracion > 0.15) {
    alert(
      "❌ Error en Costos de Estructuración\n\nLos costos de estructuración deben estar entre 0.10% y 0.15%.\nRango permitido: 0.10% - 0.15%\nValor ingresado: " +
        costosEstructuracion +
        "%"
    );
    return false;
  }

  if (costosColocacion < 0.11 || costosColocacion > 0.16) {
    alert(
      "❌ Error en Costos de Colocación\n\nLos costos de colocación deben estar entre 0.11% y 0.16%.\nRango permitido: 0.11% - 0.16%\nValor ingresado: " +
        costosColocacion +
        "%"
    );
    return false;
  }

  return true;
};

const precioBono = computed(() => {
  if (cashFlowData.value.length === 0) return 0;

  const tasaCok = cok.value / 100;
  const flujos = cashFlowData.value;
  const valorNominal = parseFloat(bondData.value.monto);
  let precio = 0;

  console.log("📊 Flujos utilizados para calcular el Precio del Bono:");
  console.table(
    flujos.map((f, i) => ({
      Periodo: i + 1,
      Cuota: f.cuota,
      Interés: f.interes,
      Amortización: f.amortizacion,
      SaldoInicial: f.saldoInicial,
      SaldoFinal: f.saldoFinal,
      PlazoGracia: f.plazoGracia,
    }))
  );

  flujos.forEach((flujo, index) => {
    const t = index + 1;
    const descuento = flujo.cuota / Math.pow(1 + tasaCok, t);
    console.log(
      `🧮 t=${t}, Cuota=${flujo.cuota}, Descuento=${descuento.toFixed(2)}`
    );
    precio += descuento;
  });

  const n = flujos.length;
  const valorNominalDescontado = valorNominal / Math.pow(1 + tasaCok, n);
  console.log(
    `🏁 Valor nominal descontado (t=${n}): ${valorNominalDescontado.toFixed(2)}`
  );

  precio += valorNominalDescontado;

  console.log(`✅ Precio final del bono calculado: ${precio.toFixed(2)}`);

  return parseFloat(precio.toFixed(2));
});

const getTasaSemestral = (tasaAnual, usarTasaEfectiva = false) => {
  const tasa = tasaAnual / 100;

  if (usarTasaEfectiva) {
    return Math.pow(1 + tasa, 1 / 2) - 1;
  } else {
    const tasaEfectivaAnual = Math.pow(1 + tasa / 2, 2) - 1;
    return Math.pow(1 + tasaEfectivaAnual, 1 / 2) - 1;
  }
};

const getPeriodosSemestrales = (plazoAnios) => {
  return plazoAnios * 2;
};

const calcularCuotaFrancesa = (capital, tasa, periodos) => {
  if (tasa === 0) return capital / periodos;
  const factor = Math.pow(1 + tasa, periodos);
  return (capital * tasa * factor) / (factor - 1);
};

const calculateCashFlow = () => {
  if (!validateInputData()) {
    return;
  }

  const monto = parseFloat(bondData.value.monto);
  const tasaAnual = bondData.value.usarTasaEfectiva
    ? parseFloat(bondData.value.tasaEfectivaAnual)
    : parseFloat(bondData.value.interes);
  const plazoAnios = parseFloat(bondData.value.plazo);
  const usarTasaEfectiva = bondData.value.usarTasaEfectiva;

  const tasaSemestral = getTasaSemestral(tasaAnual, usarTasaEfectiva);
  const periodosSemestrales = getPeriodosSemestrales(plazoAnios);

  metrics.value.tasaEfectivaPeriodo = tasaSemestral;
  metrics.value.periodosAnio = 2;

  let flujo = [];
  let saldoPendiente = monto;

  const cuotaFrancesa = calcularCuotaFrancesa(
    saldoPendiente,
    tasaSemestral,
    periodosSemestrales
  );

  for (let i = 0; i < periodosSemestrales; i++) {
    const periodo = i + 1;
    const saldoInicial = saldoPendiente;
    const interes = saldoPendiente * tasaSemestral;
    let cuota = cuotaFrancesa;
    let amortizacion = cuota - interes;

    if (i === periodosSemestrales - 1) {
      amortizacion = saldoPendiente;
      cuota = amortizacion + interes;
    }

    saldoPendiente -= amortizacion;

    const plazosGraciaActuales = cashFlowData.value.map((f) => f.plazoGracia);
    const plazoGracia = plazosGraciaActuales[i] || "N";

    if (plazoGracia === "T") {
      cuota = 0;
      amortizacion = 0;
      saldoPendiente = saldoInicial + interes;
    } else if (plazoGracia === "P") {
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
      plazoGracia,
    });
  }

  cashFlowData.value = flujo;
  calcularMetricas();
};

const calcularTIR = (flujos, montoInicial, guess = 0.05) => {
  const maxIter = 1000;
  const precision = 1e-7;
  let tasa = guess;

  for (let i = 0; i < maxIter; i++) {
    let f = -montoInicial;
    let df = 0;

    for (let j = 0; j < flujos.length; j++) {
      const t = j + 1;
      const v = flujos[j].cuota;
      const base = Math.pow(1 + tasa, t);
      const baseDf = Math.pow(1 + tasa, t + 1);

      if (!isFinite(base) || !isFinite(baseDf)) return NaN;

      f += v / base;
      df += (-t * v) / baseDf;
    }

    if (Math.abs(df) < 1e-10) return NaN;

    const nuevaTasa = tasa - f / df;
    if (!isFinite(nuevaTasa)) return NaN;

    if (Math.abs(nuevaTasa - tasa) < precision) return nuevaTasa;
    tasa = nuevaTasa;
  }

  return NaN;
};

const calcularMetricas = () => {
  const monto = parseFloat(bondData.value.monto);
  const tasaAnual = bondData.value.usarTasaEfectiva
    ? parseFloat(bondData.value.tasaEfectivaAnual) / 100
    : parseFloat(bondData.value.interes) / 100;
  const flujos = cashFlowData.value;

  if (flujos.length === 0) return;

  const tasaSemestral = metrics.value.tasaEfectivaPeriodo;

  const totalCostosTREA =
    (costosAdicionales.value.costosCavali / 100 +
      costosAdicionales.value.comisionCasaBolsa / 100) *
    monto;

  const totalCostosTCEA =
    (costosAdicionales.value.costosCavali / 100 +
      costosAdicionales.value.costosEstructuracion / 100 +
      costosAdicionales.value.costosColocacion / 100) *
    monto;

  metrics.value.totalCostosTREA = totalCostosTREA;
  metrics.value.totalCostosTCEA = totalCostosTCEA;

  const montoConCostosTCEA = monto + totalCostosTREA;
  const montoNetoTREA = monto - totalCostosTCEA;

  const tirSemestralTCEA = calcularTIR(flujos, montoConCostosTCEA, tasaAnual);
  const teaTCEA = Math.pow(1 + tirSemestralTCEA, 2) - 1;
  metrics.value.tasaCostoEfectivoAnual = parseFloat(teaTCEA.toFixed(6));

  const tirSemestralTREA = calcularTIR(flujos, montoNetoTREA, tasaAnual);
  const teaTREA = Math.pow(1 + tirSemestralTREA, 2) - 1;
  metrics.value.tasaRendimientoEfectivoAnual = parseFloat(teaTREA.toFixed(6));

  let duracion = 0;
  let valorPresenteBase = 0;
  let convexidad = 0;
  const tasa = tasaSemestral;
  const valorNominal = parseFloat(bondData.value.monto);

  flujos.forEach((flujo, index) => {
    const t = index + 1;
    let flujoEfectivo = flujo.cuota;

    if (t === flujos.length) {
      flujoEfectivo += valorNominal;
    }

    const vp = flujoEfectivo / Math.pow(1 + tasa, t);

    duracion += t * vp;
    convexidad += t * (t + 1) * vp;
    valorPresenteBase += vp;
  });

  metrics.value.duracion = parseFloat(
    (duracion / valorPresenteBase / 2).toFixed(4)
  );

  metrics.value.convexidad = parseFloat(
    (convexidad / (valorPresenteBase * Math.pow(1 + tasa, 2)) / 4).toFixed(4)
  );
};

const updateGracePeriod = (rowData, newValue) => {
  rowData.plazoGracia = newValue;
  if (cashFlowData.value.length > 0) {
    calculateCashFlow();
  }
};

const capitalizacionInfo = computed(() => {
  const tasaInput = bondData.value.usarTasaEfectiva
    ? bondData.value.tasaEfectivaAnual
    : bondData.value.interes;
  const tasaSemestral = getTasaSemestral(
    tasaInput,
    bondData.value.usarTasaEfectiva
  );
  const periodos = getPeriodosSemestrales(bondData.value.plazo);

  const tipoTasa = bondData.value.usarTasaEfectiva
    ? "Efectiva Anual"
    : "Nominal Anual";

  return `Tasa ${tipoTasa}: ${tasaInput}% | Tasa efectiva semestral: ${(
    tasaSemestral * 100
  ).toFixed(4)}% | Períodos semestrales: ${periodos}`;
});
</script>

<template>
  <div class="cash-flow-container">
    <div class="content">
      <div class="back-button-container">
        <pv-button
          label="Volver al menú"
          icon="pi pi-arrow-left"
          @click="backtomenu"
          class="back-button"
        />
      </div>

      <h1 class="page-title">Calculadora de Bonos - BonosAlFallo</h1>

      <div class="input-section">
        <h2>Datos de entrada</h2>
        <div class="input-group">
          <CurrencySelector
            v-model="selectedCurrency"
            :options="['PEN', 'USD', 'EUR']"
          />
        </div>
        <div class="input-grid">
          <div class="input-group">
            <label for="monto">Monto del bono</label>
            <pv-dropdown
              id="monto"
              v-model="bondData.monto"
              :options="montoOptions"
              option-label="label"
              option-value="value"
              placeholder="Seleccionar monto"
              class="w-full"
            />
          </div>

          <div class="input-group">
            <label for="plazo">Plazo del bono (años)</label>
            <pv-input-text
              id="plazo"
              v-model="bondData.plazo"
              type="number"
              step="0.5"
              :min="3"
              :max="20"
              placeholder="3"
            />
          </div>

          <div class="input-group checkbox-group">
            <div class="checkbox-container">
              <pv-checkbox
                id="usarTasaEfectiva"
                v-model="bondData.usarTasaEfectiva"
                :binary="true"
              />
              <label for="usarTasaEfectiva">Usar Tasa Efectiva Anual</label>
            </div>
          </div>
        </div>

        <div class="rate-section">
          <div v-if="bondData.usarTasaEfectiva" class="input-group">
            <label for="tasaEfectivaAnual">Tasa Efectiva Anual (%)</label>
            <pv-input-text
              id="tasaEfectivaAnual"
              v-model="bondData.tasaEfectivaAnual"
              type="number"
              step="0.01"
              :min="2.5"
              :max="8.0"
              placeholder="5.0"
            />
          </div>

          <div v-else class="input-group">
            <label for="interes">Tasa Nominal Anual (%)</label>
            <pv-input-text
              id="interes"
              v-model="bondData.interes"
              type="number"
              step="0.01"
              :min="2.5"
              :max="8.0"
              placeholder="5.0"
            />
          </div>
        </div>
        <div class="input-group cok-highlight">
          <label for="cok" class="cok-tooltip">
            Costo de Oportunidad del Capital (COK %)
          </label>
          <pv-input-text
            id="cok"
            v-model="cok"
            type="number"
            step="0.1"
            :min="3"
            :max="20"
            placeholder="10.0"
            class="cok-input"
          />
        </div>
      </div>

      <div class="costs-section">
        <h2>Costos Adicionales (% del monto)</h2>

        <div class="costs-grid">
          <div class="cost-group">
            <h3>Para TREA (Tasa de Rendimiento)</h3>
            <div class="cost-inputs">
              <div class="input-group">
                <label for="costosCavali">Costos CAVALI (%)</label>
                <pv-input-text
                  id="costosCavali"
                  v-model="costosAdicionales.costosCavali"
                  type="number"
                  step="0.01"
                  placeholder="0.052"
                />
              </div>

              <div class="input-group">
                <label for="comisionCasaBolsa"
                  >Comisión Casa de Bolsa (%)</label
                >
                <pv-input-text
                  id="comisionCasaBolsa"
                  v-model="costosAdicionales.comisionCasaBolsa"
                  type="number"
                  step="0.01"
                  placeholder="0.3"
                />
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
                  placeholder="0.052"
                />
              </div>

              <div class="input-group">
                <label for="costosEstructuracion"
                  >Costos de Estructuración (%) [0.10-0.15]</label
                >
                <pv-input-text
                  id="costosEstructuracion"
                  v-model="costosAdicionales.costosEstructuracion"
                  type="number"
                  step="0.01"
                  :min="0.1"
                  :max="0.15"
                  placeholder="0.10"
                />
              </div>

              <div class="input-group">
                <label for="costosColocacion"
                  >Costos de Colocación (%) [0.11-0.16]</label
                >
                <pv-input-text
                  id="costosColocacion"
                  v-model="costosAdicionales.costosColocacion"
                  type="number"
                  step="0.01"
                  :min="0.11"
                  :max="0.16"
                  placeholder="0.11"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="calculate-button-container">
          <pv-button
            label="Calcular Flujo de Caja"
            @click="calculateCashFlow"
            class="calculate-button"
            icon="pi pi-calculator"
          />
        </div>
      </div>

      <div class="table-container" v-if="cashFlowData.length > 0">
        <h3>Flujo de Caja Semestral</h3>
        <pv-data-table
          :value="cashFlowData"
          showGridlines
          :scrollable="true"
          scrollHeight="400px"
          tableStyle="min-width: 50rem"
          class="p-datatable-gridlines"
        >
          <pv-column
            field="no"
            header="Semestre"
            style="min-width: 80px"
          ></pv-column>
          <pv-column
            field="saldoInicial"
            header="Saldo inicial"
            style="min-width: 120px"
          >
            <template #body="slotProps">
              {{
                slotProps.data.saldoInicial.toLocaleString("es-PE", {
                  style: "currency",
                  currency: selectedCurrency,
                  minimumFractionDigits: 2,
                })
              }}
            </template>
          </pv-column>
          <pv-column field="interes" header="Interés" style="min-width: 100px">
            <template #body="slotProps">
              {{
                slotProps.data.interes.toLocaleString("es-PE", {
                  style: "currency",
                  currency: selectedCurrency,
                  minimumFractionDigits: 2,
                })
              }}
            </template>
          </pv-column>
          <pv-column field="cuota" header="Cuota" style="min-width: 100px">
            <template #body="slotProps">
              {{
                slotProps.data.cuota.toLocaleString("es-PE", {
                  style: "currency",
                  currency: selectedCurrency,
                  minimumFractionDigits: 2,
                })
              }}
            </template>
          </pv-column>
          <pv-column
            field="amortizacion"
            header="Amortización"
            style="min-width: 120px"
          >
            <template #body="slotProps">
              {{
                slotProps.data.amortizacion.toLocaleString("es-PE", {
                  style: "currency",
                  currency: selectedCurrency,
                  minimumFractionDigits: 2,
                })
              }}
            </template>
          </pv-column>
          <pv-column
            field="saldoFinal"
            header="Saldo final"
            style="min-width: 120px"
          >
            <template #body="slotProps">
              {{
                slotProps.data.saldoFinal.toLocaleString("es-PE", {
                  style: "currency",
                  currency: selectedCurrency,
                  minimumFractionDigits: 2,
                })
              }}
            </template>
          </pv-column>
          <pv-column
            field="plazoGracia"
            header="Plazo de gracia"
            style="min-width: 150px"
          >
            <template #body="slotProps">
              <pv-dropdown
                v-model="slotProps.data.plazoGracia"
                :options="gracePeriodOptions"
                option-label="label"
                option-value="value"
                @update:modelValue="
                  (newValue) => updateGracePeriod(slotProps.data, newValue)
                "
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
            <div class="metric-label">
              TREA - Tasa de Rendimiento Efectivo Anual
            </div>
            <div class="metric-value">
              {{ (metrics.tasaCostoEfectivoAnual * 100).toFixed(2) }}%
            </div>
            <div class="metric-detail">
              Costos incluidos: S/
              {{
                metrics.totalCostosTCEA.toLocaleString("es-PE", {
                  minimumFractionDigits: 2,
                })
              }}
            </div>
          </div>

          <div class="metric-card trea">
            <div class="metric-label">TCEA - Tasa de Costo Efectivo Anual</div>
            <div class="metric-value">
              {{ (metrics.tasaRendimientoEfectivoAnual * 100).toFixed(2) }}%
            </div>
            <div class="metric-detail">
              Costos incluidos: S/
              {{
                metrics.totalCostosTREA.toLocaleString("es-PE", {
                  minimumFractionDigits: 2,
                })
              }}
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
      <div v-if="cashFlowData.length > 0" class="precio-bono-card">
        <h3>💰 Precio de Venta Máximo del Bono</h3>
        <div class="precio-valor precio-animado">
          {{
            selectedCurrency === "PEN"
              ? "S/"
              : selectedCurrency === "USD"
              ? "$"
              : "€"
          }}
          {{ precioBono.toLocaleString("es-PE", { minimumFractionDigits: 2 }) }}
        </div>
        <div class="precio-detail">
          Calculado con COK = {{ cok }}% | Valor presente de flujos futuros
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap");

.cash-flow-container {
  font-family: "Work Sans", sans-serif;
  font-weight: 400;
  font-optical-sizing: auto;
  font-weight: weight;
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
}

.back-button-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
}

.back-button {
  background: rgba(30, 41, 59, 0.8);
  color: #e2e8f0;
  border: 1px solid rgba(59, 130, 246, 0.3);
  font-weight: bold;
  backdrop-filter: blur(15px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.back-button:hover {
  background: rgba(30, 41, 59, 1);
  color: #ffffff;
  border-color: rgba(96, 165, 250, 0.6);
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

.input-section,
.costs-section {
  margin-bottom: 2rem;
  background: rgba(15, 23, 42, 0.7);
  padding: 1.5rem;
  border-radius: 16px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.input-section h2,
.costs-section h2 {
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

/* Estilos para el input de COK - ya existente pero mejorado */
.cok-input-group {
  background: rgba(30, 41, 59, 0.6);
  padding: 1.2rem;
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.3);
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.cok-input-group:hover {
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.2);
  transform: translateY(-2px);
}

.cok-input-group label {
  color: #60a5fa;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  display: block;
}

.cok-input-group .p-inputtext {
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(59, 130, 246, 0.4);
  color: #e2e8f0;
  font-size: 1rem;
  font-weight: 500;
}

/* Estilos para el card del Precio de Venta Máximo del Bono - mejorado */
.precio-bono-card {
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.1) 0%,
    rgba(16, 185, 129, 0.1) 100%
  );
  border: 2px solid rgba(34, 197, 94, 0.4);
  border-radius: 16px;
  padding: 2rem;
  margin-top: 2rem;
  backdrop-filter: blur(15px);
  box-shadow: 0 8px 32px rgba(34, 197, 94, 0.2);
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.precio-bono-card::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(34, 197, 94, 0.05) 0%,
    transparent 70%
  );
  animation: pulse 3s ease-in-out infinite;
}

.precio-bono-card:hover {
  transform: translateY(-5px);
  border-color: rgba(34, 197, 94, 0.6);
  box-shadow: 0 12px 40px rgba(34, 197, 94, 0.3);
}

.precio-bono-card h3 {
  color: #e2e8f0;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.precio-valor {
  font-size: 2.5rem;
  font-weight: 800;
  color: #4ade80;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
  position: relative;
  z-index: 1;
}

.precio-detail {
  color: #94a3b8;
  font-size: 0.95rem;
  font-style: italic;
  position: relative;
  z-index: 1;
}

/* Animación para el efecto de pulso */
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.1;
  }
}

/* Estilos adicionales para mejorar la integración */
.enhanced-input-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cok-highlight {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.1) 0%,
    rgba(147, 51, 234, 0.1) 100%
  );
  border: 1px solid rgba(59, 130, 246, 0.3);
  padding: 1.5rem;
  border-radius: 12px;
  margin-top: 1rem;
  backdrop-filter: blur(10px);
}

.cok-highlight label {
  color: #a78bfa;
  font-weight: 600;
  font-size: 1rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .precio-bono-card {
    padding: 1.5rem;
    margin-top: 1.5rem;
  }

  .precio-valor {
    font-size: 2rem;
  }

  .precio-bono-card h3 {
    font-size: 1.1rem;
  }

  .cok-input-group {
    padding: 1rem;
  }
}

/* Efecto de escritura animada para el precio */
.precio-animado {
  animation: slideInFromRight 0.8s ease-out;
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Indicador visual para COK */
.cok-indicator {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #60a5fa;
  font-size: 1.2rem;
  pointer-events: none;
}

/* Tooltip para COK */
.cok-tooltip {
  position: relative;
  display: inline-block;
}

.cok-tooltip::after {
  content: "El COK representa la rentabilidad mínima exigida por el inversionista";
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 23, 42, 0.95);
  color: #e2e8f0;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(59, 130, 246, 0.3);
  z-index: 1000;
}

.cok-tooltip:hover::after {
  opacity: 1;
  visibility: visible;
}
</style>
