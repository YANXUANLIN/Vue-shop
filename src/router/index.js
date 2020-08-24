import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    redirect:'/Login'
  },
  {
    path: '/Login',
    component:Login,
   }
]

const router = new VueRouter({
  routes
})

export default router
