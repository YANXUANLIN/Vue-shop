import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue';
import Home from '../components/Home.vue';
import Welcome from '../components/Welcome.vue';
import Users from '../components/user/Users.vue';
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/Login'
  },
  {
    path: '/Login',
    component: Login,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/Home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/Users', component: Users }
    ]
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

//挂载路由守卫 挂载后要重新打包
router.beforeEach((to, from, next) => {
  //to 将要访问的路径 
  //from 代表从哪个路径跳转过来
  //next 是个函数 表示放行
  //next('/login') 强制跳转
  if (to.path === '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next();
})

export default router
