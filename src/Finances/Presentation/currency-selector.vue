<script setup>
import { ref, watch } from "vue";

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    default: () => ["PEN", "USD"],
  },
});

// Relacionar monedas con banderas (emoji)
const currencyFlags = {
  PEN: "🇵🇪",
  USD: "🇺🇸",
  EUR: "🇪🇺",
};

const selectedCurrency = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    selectedCurrency.value = newVal;
  }
);

watch(selectedCurrency, (newVal) => {
  emit("update:modelValue", newVal);
});
</script>

<template>
  <div class="currency-selector">
    <label for="currency" class="label">Moneda:</label>
    <select id="currency" v-model="selectedCurrency" class="currency-dropdown">
      <option v-for="currency in options" :key="currency" :value="currency">
        {{ currencyFlags[currency] || "" }} {{ currency }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.currency-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.label {
  color: #fff;
  font-weight: 500;
}

.currency-dropdown {
  background-color: #1f2937;
  color: white;
  border: 1px solid #4b5563;
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  font-size: 0.95rem;
}

.currency-dropdown:focus {
  outline: none;
  border-color: #60a5fa;
}
</style>
