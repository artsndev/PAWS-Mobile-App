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
    path: '/vet/login',
    name: 'Vet Login',
    component: () => import('../components/vet/auth/Login.vue'),
    meta: {
      vet: true,
    }
  },
  {
    path: '/vet/register',
    name: 'Vet Register',
    component: () => import('../components/vet/auth/Register.vue'),
    meta: {
      vet: true,
    }
  },
  {
    path: '/vet/dashboard',
    name: 'Vet Dashboard',
    component: () => import('../components/vet/Dashboard.vue'),
    meta: {
      requiresVetAuth: true,
    }
  },
  {
    path: '/vet/appointments',
    name: 'Vet Appointment',
    component: () => import('../components/vet/Appointment.vue'),
    meta: {
      requiresVetAuth: true,
    }
  },
  {
    path: '/vet/schedules',
    name: 'Vet Schedule',
    component: () => import('../components/vet/Schedule.vue'),
    meta: {
      requiresVetAuth: true,
    }
  },
  {
      path: '/vet/users',
      name: 'Vet User',
      component: () => import('../components/vet/User.vue'),
      meta: {
        requiresVetAuth: true,
      }
  },
  {
      path: '/vet/queues',
      name: 'Vet Queue',
      component: () => import('../components/vet/Queue.vue'),
      meta: {
        requiresVetAuth: true,
      }
  },

  // User Web Routes
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/user/auth/Login.vue'),
    meta: {
      user: true,
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../components/user/auth/Register.vue'),
    meta: {
      user: true,
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../components/user/Dashboard.vue'),
    meta: {
      requiresUserAuth: true,
    }
  },
  {
    path: '/pet',
    name: 'Pet',
    component: () => import('../components/user/Pet.vue'),
    meta: {
      requiresUserAuth: true,
    }
  },
  {
    path: '/pet/profile/:id',
    name: 'Pet Profile',
    component: () => import('../components/user/PetProfile.vue'),
    meta: {
      requiresUserAuth: true,
    }
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
      next({ name: 'Vet Login' });
  } else if (vet && isVetLoggedIn) {
      next({ name: 'Vet Dashboard' });
  } else {
      next();
  }
});

// User Auth Middleware
router.beforeEach((to, from, next) => {
  const requiresUserAuth = to.matched.some(record => record.meta.requiresUserAuth);
  const user = to.matched.some(record => record.meta.user);
  const isUserLoggedIn = localStorage.getItem('userToken');
  if (requiresUserAuth && !isUserLoggedIn) {
      next({ name: 'Login' });
  } else if (user && isUserLoggedIn) {
      next({ name: 'Home' });
  } else {
      next();
  }
});
export default router
