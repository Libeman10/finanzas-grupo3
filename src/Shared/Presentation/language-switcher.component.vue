<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const {locale} = useI18n()
const languages = ref([
  "es","en"
])
</script>

<template>
  <pv-select-button v-model="locale" :options="languages" class="language-switcher uppercase"/>
</template>

<style scoped>
.language-switcher {
  padding: 0.5rem;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-switcher:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>  