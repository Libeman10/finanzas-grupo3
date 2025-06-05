import { createRouter, createWebHistory } from "vue-router";
import TheHome from '../Shared/Presentation/home-view.page.vue';
import theLoginPage from "../Shared/Presentation/the-login.page.vue";
import theRegisterPage from "../Shared/Presentation/the-register.page.vue";
import interestRatePage from "../Finances/Presentation/interest-rate.page.vue";
import cashFlowPage from "../Finances/Presentation/cash-flow.page.vue";
import theConfigurationPage from "../Finances/Presentation/the-configuration.page.vue";

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
            path: '/interest-rate',
            name: 'interest-rate',
            component: interestRatePage
        },
        {
            path: '/cash-flow',
            name: 'cash-flow',
            component: cashFlowPage
        },
        {
            path: '/the-configuration',
            name: 'the-configuration',
            component: theConfigurationPage
        }

    ],
})
export default router;