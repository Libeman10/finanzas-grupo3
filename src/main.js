import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Lara from '@primeuix/themes/lara';
import Card from 'primevue/card';
import FloatLabel from 'primevue/floatlabel';
import SelectButton  from 'primevue/selectbutton';
import i18n from './i18n'
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Divider from 'primevue/divider';
import Toolbar from 'primevue/toolbar';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import DataView from 'primevue/dataview';
import Sidebar from 'primevue/sidebar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   
import Row from 'primevue/row';                   
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';


import router from './router'


const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Lara
    }
});

app.component('pv-checkbox', Checkbox);
app.component('pv-data-table', DataTable);
app.component('pv-column', Column);
app.component('pv-column-group', ColumnGroup);  
app.component('pv-row', Row);                   
app.component('pv-button', Button);
app.component('pv-sidebar', Sidebar);
app.component('pv-dropdown', Dropdown);
app.component('pv-data-view', DataView);
app.component('pv-float-label', FloatLabel); 
app.component('pv-input-text', InputText);
app.component('pv-card', Card);
app.component('pv-select-button', SelectButton);
app.component('pv-divider', Divider);
app.component('pv-toolbar', Toolbar);
app.component('pv-icon-field', IconField);
app.component('pv-input-icon', InputIcon);
app.use(i18n);
app.use(router);
app.mount('#app');
