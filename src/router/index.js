import Vue from 'vue';
import VueRouter from 'vue-router';

import { userKey } from '@/global';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    meta: { requiresLogged: true },
  },
  {
    path: '/home/gym',
    name: 'Home Gym',
    component: () => import(/* webpackChunkName: "home-gym" */ '../views/HomeGym.vue'),
    meta: { requiresLogged: true, requiresNotUser: true },
  },
  {
    path: '/gym',
    name: 'Academia',
    component: () => import(/* webpackChunkName: "gym" */ '../views/Gym.vue'),
    meta: { requiresLogged: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import(/* webpackChunkName: "login" */ '../views/Logout.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const json = localStorage.getItem(userKey);
  const user = JSON.parse(json);

  if (to.matched.some((record) => record.meta.requiresNotUser)) {
    if (user.role === 'user') {
      next({ path: '/' });
    } else {
      next();
    }
  }

  if (to.matched.some((record) => record.meta.requiresLogged)) {
    if (user) {
      next();
    } else {
      next({ path: '/login' });
    }
  } else {
    next();
  }
});

export default router;
