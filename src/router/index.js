import { createRouter, createWebHistory } from 'vue-router'

// Create your Client-Side Routing here
const routes = [
  {
    path: '/',
    redirect: {
      name: 'Home',
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/vet/auth/Login.vue'),
    meta: {
      vet: true,
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../components/vet/auth/Register.vue'),
    meta: {
      vet: true,
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../components/vet/Home.vue'),
    meta: {
      requiresVetAuth: true,
    }
  },
  {
    path: '/appointments',
    name: 'Appointment',
    component: () => import('../components/vet/Appointment.vue'),
  },
  {
      path: '/users',
      name: 'User',
      component: () => import('../components/vet/User.vue'),
  },
  {
      path: '/queues',
      name: 'Queue',
      component: () => import('../components/vet/Queue.vue'),
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Vet Auth Middleware
router.beforeEach((to, from, next) => {
  const requiresVetAuth = to.matched.some(record => record.meta.requiresVetAuth);
  const vet = to.matched.some(record => record.meta.vet);
  const isVetLoggedIn = localStorage.getItem('vetToken');
  if (requiresVetAuth && !isVetLoggedIn) {
      next({ name: 'Login' });
  } else if (vet && isVetLoggedIn) {
      next({ name: 'Home' });
  } else {
      next();
  }
});
export default router
