import { createRouter, createWebHistory } from "vue-router";
import TheHome from '../Shared/Presentation/home-view.page.vue';
import theLoginPage from "../Shared/Presentation/the-login.page.vue";
import theRegisterPage from "../Shared/Presentation/the-register.page.vue";
import cashFlowPage from "../Finances/Presentation/cash-flow.page.vue";
import theHistorialPage from "@/Finances/Presentation/the-historial.page.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: TheHome
        },
        {
          path: '/login',
          name: 'login',
          component: theLoginPage  
        },
        {
          path: '/register',
          name: 'register',
          component: theRegisterPage  
        },
        {
            path: '/cash-flow',
            name: 'cash-flow',
            component: cashFlowPage
        },
        {
            path: '/the-historial',
            name: 'the-historial',
            component: theHistorialPage
        }

    ],
})
export default router;