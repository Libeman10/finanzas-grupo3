import en from './Locale/en.json'
import es from './Locale/es.json'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
    locale: 'es',
    fallblackLocale: 'es',
    messages: {
        en,
        es
    }

})

export default i18n